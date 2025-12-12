"""
CanConnect Payment System Module

This module provides mock payment gateway functionality for the CanConnect
e-government services platform.

Components:
- gateway.py: Mock payment gateway and processing
- receipt.py: PDF receipt generation
"""

from .gateway import PaymentGateway
from .receipt import ReceiptGenerator

__all__ = ['PaymentGateway', 'ReceiptGenerator']
