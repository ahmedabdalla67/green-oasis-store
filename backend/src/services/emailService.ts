import nodemailer from 'nodemailer';

// Create transporter based on environment
const createTransporter = () => {
    // For development, use ethereal (fake SMTP for testing)
    if (process.env.NODE_ENV !== 'production' && !process.env.EMAIL_HOST) {
        // Create test account on demand
        return null; // Will create on first use
    }

    // For production or if SMTP is configured
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: Number(process.env.EMAIL_PORT) || 587,
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

let transporter: nodemailer.Transporter | null = createTransporter();

// Initialize transporter for development
const getTransporter = async (): Promise<nodemailer.Transporter> => {
    if (transporter) return transporter;

    // Create ethereal test account for development
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });

    console.log('📧 Using Ethereal test email account:', testAccount.user);
    return transporter;
};

// Store name and info
const STORE_NAME = process.env.STORE_NAME || 'Green Oasis - واحة الخضرة';
const STORE_PHONE = process.env.STORE_PHONE || '';
const STORE_EMAIL = process.env.EMAIL_FROM || 'noreply@greenoasis.com';

// ===================
// Email Templates
// ===================

const orderConfirmationTemplate = (order: {
    id: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
    shippingCost: number;
    governorate: string;
    address: string;
    paymentMethod: string;
}) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { padding: 30px; }
        .order-id { background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
        .order-id strong { color: #16a34a; font-size: 18px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { padding: 12px; text-align: right; border-bottom: 1px solid #eee; }
        th { background: #f8f8f8; }
        .total { font-size: 20px; font-weight: bold; color: #16a34a; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 ${STORE_NAME}</h1>
            <p style="margin: 10px 0 0;">شكراً لطلبك!</p>
        </div>
        <div class="content">
            <div class="order-id">
                رقم الطلب: <strong>#${order.id.slice(0, 8).toUpperCase()}</strong>
            </div>
            
            <p>مرحباً <strong>${order.customerName}</strong>،</p>
            <p>تم استلام طلبك بنجاح وجاري تجهيزه للشحن.</p>
            
            <table>
                <thead>
                    <tr>
                        <th>المنتج</th>
                        <th>الكمية</th>
                        <th>السعر</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.quantity}</td>
                            <td>${item.price * item.quantity} جنيه</td>
                        </tr>
                    `).join('')}
                    <tr>
                        <td colspan="2">الشحن (${order.governorate})</td>
                        <td>${order.shippingCost} جنيه</td>
                    </tr>
                    <tr>
                        <td colspan="2" class="total">الإجمالي</td>
                        <td class="total">${order.totalAmount} جنيه</td>
                    </tr>
                </tbody>
            </table>
            
            <p><strong>عنوان التوصيل:</strong> ${order.address}</p>
            <p><strong>طريقة الدفع:</strong> ${order.paymentMethod === 'cash' ? 'الدفع عند الاستلام' : 'فودافون كاش'}</p>
        </div>
        <div class="footer">
            <p>إذا كان لديك أي استفسار، تواصل معنا</p>
            <p>${STORE_PHONE ? `📞 ${STORE_PHONE}` : ''}</p>
        </div>
    </div>
</body>
</html>
`;

const orderStatusTemplate = (order: {
    id: string;
    customerName: string;
    status: string;
    statusArabic: string;
}) => `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: 'Segoe UI', Tahoma, sans-serif; background: #f4f4f4; margin: 0; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 10px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #16a34a, #15803d); color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; text-align: center; }
        .status { font-size: 24px; font-weight: bold; color: #16a34a; margin: 20px 0; }
        .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🌿 ${STORE_NAME}</h1>
        </div>
        <div class="content">
            <p>مرحباً <strong>${order.customerName}</strong>،</p>
            <p>تم تحديث حالة طلبك رقم <strong>#${order.id.slice(0, 8).toUpperCase()}</strong></p>
            <p class="status">${order.statusArabic}</p>
        </div>
        <div class="footer">
            <p>شكراً لتسوقك معنا 🌱</p>
        </div>
    </div>
</body>
</html>
`;

// ===================
// Email Functions
// ===================

const statusLabels: Record<string, string> = {
    pending: '⏳ قيد الانتظار',
    processing: '📦 جاري التجهيز',
    shipped: '🚚 تم الشحن',
    delivered: '✅ تم التوصيل',
};

export const sendOrderConfirmation = async (email: string, order: {
    id: string;
    customerName: string;
    items: Array<{ name: string; quantity: number; price: number }>;
    totalAmount: number;
    shippingCost: number;
    governorate: string;
    address: string;
    paymentMethod: string;
}) => {
    try {
        const transport = await getTransporter();

        const info = await transport.sendMail({
            from: `"${STORE_NAME}" <${STORE_EMAIL}>`,
            to: email,
            subject: `تأكيد الطلب #${order.id.slice(0, 8).toUpperCase()} - ${STORE_NAME}`,
            html: orderConfirmationTemplate(order),
        });

        console.log('📧 Order confirmation sent:', info.messageId);

        // For development, log the preview URL
        if (process.env.NODE_ENV !== 'production') {
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('📧 Failed to send order confirmation:', error);
        return { success: false, error };
    }
};

export const sendOrderStatusUpdate = async (email: string, order: {
    id: string;
    customerName: string;
    status: string;
}) => {
    try {
        const transport = await getTransporter();

        const info = await transport.sendMail({
            from: `"${STORE_NAME}" <${STORE_EMAIL}>`,
            to: email,
            subject: `تحديث حالة الطلب #${order.id.slice(0, 8).toUpperCase()} - ${STORE_NAME}`,
            html: orderStatusTemplate({
                ...order,
                statusArabic: statusLabels[order.status] || order.status,
            }),
        });

        console.log('📧 Status update sent:', info.messageId);

        if (process.env.NODE_ENV !== 'production') {
            console.log('📧 Preview URL:', nodemailer.getTestMessageUrl(info));
        }

        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error('📧 Failed to send status update:', error);
        return { success: false, error };
    }
};
