import os
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from app.core.celery_app import celery


def build_ticket_html(
    user_name: str,
    booking_reference: str,
    event_title: str,
    event_location: str,
    theater_name: str,
    show_time: str,
    seat_labels: list[str],
    total_amount: int,
):
    try:
        parsed_time = datetime.fromisoformat(show_time)
        pretty_time = parsed_time.strftime("%I:%M %p | %a, %d %b %Y")
    except Exception:
        pretty_time = show_time

    seats_text = ", ".join(seat_labels)
    return f"""
    <html>
      <body style="margin:0;padding:0;background:#f4f5f7;font-family:Arial,sans-serif;color:#222;">
        <div style="max-width:620px;margin:24px auto;background:#fff;border:1px solid #ddd;">
          <div style="padding:18px 24px;border-bottom:1px solid #eee;">
            <h2 style="margin:0;font-size:22px;color:#444;">Your Tickets</h2>
          </div>
          <div style="padding:26px 24px;">
            <div style="text-align:center;margin-bottom:18px;">
              <h1 style="margin:0;font-size:34px;color:#d92027;">bookmyshow</h1>
              <p style="margin:8px 0 0;color:#2fbf71;font-size:28px;font-weight:700;">Your booking is confirmed!</p>
              <p style="margin:8px 0 0;color:#888;">Booking ID <strong style="color:#222;">{booking_reference}</strong></p>
            </div>

            <div style="border:1px solid #ececec;padding:16px;border-radius:8px;">
              <p style="margin:0 0 8px;font-size:22px;font-weight:700;color:#222;">{event_title}</p>
              <p style="margin:0 0 6px;font-size:16px;color:#444;">{pretty_time}</p>
              <p style="margin:0 0 6px;font-size:15px;color:#666;">{event_location}</p>
              <p style="margin:0 0 14px;font-size:15px;color:#666;">{theater_name}</p>
              <p style="margin:0 0 10px;font-size:24px;font-weight:700;color:#111;">{seats_text}</p>
              <p style="margin:0;font-size:16px;color:#0f7a4a;">Total Paid: Rs {total_amount}</p>
            </div>

            <p style="margin:18px 0 0;color:#555;">Booked for: <strong>{user_name}</strong></p>
          </div>
        </div>
      </body>
    </html>
    """


def send_html_email(recipient: str, subject: str, html_body: str):
    smtp_host = os.environ.get("SMTP_HOST")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER")
    smtp_password = os.environ.get("SMTP_PASSWORD")
    from_email = os.environ.get("FROM_EMAIL", smtp_user or "tickets@bookmyshow.email")

    if not smtp_host or not smtp_user or not smtp_password:
        print(f"[EMAIL SKIPPED] Missing SMTP config. Intended recipient={recipient}, subject={subject}")
        return

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = recipient
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(smtp_user, smtp_password)
        server.sendmail(from_email, [recipient], msg.as_string())


@celery.task
def send_booking_confirmation(
    user_email,
    user_name,
    admin_email,
    booking_reference,
    event_title,
    event_location,
    show_time,
    theater_name,
    seat_labels,
    total_amount,
):
    html = build_ticket_html(
        user_name=user_name,
        booking_reference=booking_reference,
        event_title=event_title,
        event_location=event_location,
        theater_name=theater_name,
        show_time=show_time,
        seat_labels=seat_labels,
        total_amount=total_amount,
    )

    send_html_email(
        recipient=user_email,
        subject=f"Your Tickets - {event_title}",
        html_body=html,
    )

    send_html_email(
        recipient=admin_email,
        subject=f"New Booking Alert - {booking_reference}",
        html_body=html,
    )

    return "Emails processed"
