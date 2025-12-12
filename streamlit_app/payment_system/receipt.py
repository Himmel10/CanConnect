from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.units import inch
from datetime import datetime
import os

class ReceiptGenerator:
    """Generate PDF receipts for payments"""
    
    def __init__(self, output_dir="receipts"):
        self.output_dir = output_dir
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)
    
    def generate_receipt(self, payment_data, citizen_info, service_info):
        """Generate a PDF receipt"""
        
        # Create filename
        filename = f"{payment_data['transaction_id']}.pdf"
        filepath = os.path.join(self.output_dir, filename)
        
        # Create PDF
        doc = SimpleDocTemplate(filepath, pagesize=letter,
                              rightMargin=0.5*inch, leftMargin=0.5*inch,
                              topMargin=0.5*inch, bottomMargin=0.5*inch)
        
        # Container for elements
        elements = []
        styles = getSampleStyleSheet()
        
        # Custom styles
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=24,
            textColor=colors.HexColor('#0066A1'),
            spaceAfter=6,
            alignment=1  # Center
        )
        
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=colors.HexColor('#004D7A'),
            spaceAfter=6
        )
        
        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=10,
            spaceAfter=4
        )
        
        # Header
        elements.append(Paragraph("CANCONNECT", title_style))
        elements.append(Paragraph("Municipality of Cantilan", styles['Normal']))
        elements.append(Paragraph("Surigao del Sur 8317", styles['Normal']))
        elements.append(Spacer(1, 0.2*inch))
        
        # Receipt title
        elements.append(Paragraph("OFFICIAL RECEIPT", heading_style))
        elements.append(Spacer(1, 0.1*inch))
        
        # Receipt info
        receipt_info = [
            ['Receipt #:', payment_data['transaction_id']],
            ['Date:', datetime.now().strftime("%B %d, %Y")],
            ['Time:', datetime.now().strftime("%H:%M:%S")]
        ]
        receipt_table = Table(receipt_info, colWidths=[2*inch, 3*inch])
        receipt_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ]))
        elements.append(receipt_table)
        elements.append(Spacer(1, 0.2*inch))
        
        # Citizen info
        elements.append(Paragraph("PAYER INFORMATION", heading_style))
        payer_info = [
            ['Name:', citizen_info.get('name', 'N/A')],
            ['Email:', citizen_info.get('email', 'N/A')],
            ['Phone:', citizen_info.get('phone', 'N/A')]
        ]
        payer_table = Table(payer_info, colWidths=[1.5*inch, 3.5*inch])
        payer_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f5f5')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
        ]))
        elements.append(payer_table)
        elements.append(Spacer(1, 0.2*inch))
        
        # Service info
        elements.append(Paragraph("SERVICE INFORMATION", heading_style))
        service_data = [
            ['Service:', service_info.get('service_type', 'N/A')],
            ['Description:', service_info.get('description', 'N/A')],
            ['Reference #:', service_info.get('request_id', 'N/A')]
        ]
        service_table = Table(service_data, colWidths=[1.5*inch, 3.5*inch])
        service_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#f5f5f5')),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey)
        ]))
        elements.append(service_table)
        elements.append(Spacer(1, 0.2*inch))
        
        # Payment details
        elements.append(Paragraph("PAYMENT DETAILS", heading_style))
        payment_details = [
            ['Amount Paid:', f"₱{payment_data['amount']:.2f}"],
            ['Payment Method:', payment_data['method'].title()],
            ['Payment Status:', payment_data['status']],
            ['Paid At:', datetime.now().strftime("%Y-%m-%d %H:%M:%S")]
        ]
        payment_table = Table(payment_details, colWidths=[1.5*inch, 3.5*inch])
        payment_table.setStyle(TableStyle([
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('ALIGN', (0, 1), (-1, -1), 'LEFT'),
            ('ALIGN', (1, 1), (1, 1), 'RIGHT'),
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0066A1')),
            ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f5f5f5')])
        ]))
        elements.append(payment_table)
        elements.append(Spacer(1, 0.3*inch))
        
        # Footer
        elements.append(Paragraph("___" * 20, normal_style))
        elements.append(Paragraph("Thank you for your payment!", styles['Normal']))
        elements.append(Paragraph("For inquiries, please visit the Municipal Hall or call (086) 888-xxxx", 
                                 styles['Normal']))
        elements.append(Paragraph("This is an official receipt. Please keep for your records.", 
                                 styles['Normal']))
        
        # Build PDF
        doc.build(elements)
        
        return {
            "success": True,
            "filepath": filepath,
            "filename": filename,
            "message": f"Receipt generated: {filename}"
        }
    
    def get_receipt(self, transaction_id):
        """Get receipt by transaction ID"""
        filepath = os.path.join(self.output_dir, f"{transaction_id}.pdf")
        if os.path.exists(filepath):
            return filepath
        return None
    
    def list_receipts(self):
        """List all generated receipts"""
        receipts = []
        if os.path.exists(self.output_dir):
            receipts = [f for f in os.listdir(self.output_dir) if f.endswith('.pdf')]
        return receipts
