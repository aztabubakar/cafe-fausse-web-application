from datetime import datetime

from sqlalchemy import CheckConstraint, UniqueConstraint

from app.extensions import db


class Customer(db.Model):
    __tablename__ = "customers"

    customer_id = db.Column(db.Integer, primary_key=True)
    customer_name = db.Column(db.String(255), nullable=False)
    email_address = db.Column(db.String(255), nullable=False, unique=True, index=True)
    phone_number = db.Column(db.String(50), nullable=True)
    newsletter_signup = db.Column(db.Boolean, nullable=False, default=False, server_default="false")
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    updated_at = db.Column(
        db.DateTime, nullable=False, default=datetime.utcnow, onupdate=datetime.utcnow
    )

    reservations = db.relationship("Reservation", back_populates="customer")

    def to_dict(self):
        return {
            "customer_id": self.customer_id,
            "customer_name": self.customer_name,
            "email_address": self.email_address,
            "phone_number": self.phone_number,
            "newsletter_signup": self.newsletter_signup,
        }


class Reservation(db.Model):
    __tablename__ = "reservations"
    __table_args__ = (
        CheckConstraint("table_number BETWEEN 1 AND 30", name="ck_reservations_table_number_range"),
        CheckConstraint(
            "number_of_guests BETWEEN 1 AND 12", name="ck_reservations_number_of_guests_range"
        ),
        UniqueConstraint("time_slot", "table_number", name="uq_reservations_time_slot_table_number"),
    )

    reservation_id = db.Column(db.Integer, primary_key=True)
    customer_id = db.Column(
        db.Integer, db.ForeignKey("customers.customer_id"), nullable=False, index=True
    )
    # Naive local Washington, DC time — see README "Timezone policy". Indexed
    # for the availability lookup (occupied tables for an exact timeslot).
    time_slot = db.Column(db.DateTime, nullable=False, index=True)
    table_number = db.Column(db.Integer, nullable=False)
    number_of_guests = db.Column(db.Integer, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    customer = db.relationship("Customer", back_populates="reservations")

    def to_dict(self):
        return {
            "reservation_id": self.reservation_id,
            "customer_id": self.customer_id,
            "table_number": self.table_number,
            "number_of_guests": self.number_of_guests,
            "time_slot": self.time_slot.isoformat(),
        }
