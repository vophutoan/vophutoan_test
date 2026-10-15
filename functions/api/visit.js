export async function onRequest(context) {
    // context.env chứa các biến môi trường và KV database
    const db = context.env.SITE_DATA; // Tên KV Namespace ta sẽ tạo ở bước sau
    
    // 1. Lấy thông tin người dùng từ request của Cloudflare
    const request = context.request;
    const ip = request.headers.get('cf-connecting-ip') || 'Unknown IP';
    const userAgent = request.headers.get('user-agent') || 'Unknown Device';
    const country = request.cf?.country || 'Unknown Country';
    const city = request.cf?.city || 'Unknown City';
    
    // Lấy ngày giờ hiện tại theo giờ Việt Nam
    const now = new Date();
    const vnTime = new Date(now.getTime() + (7 * 60 * 60 * 1000));
    const todayStr = vnTime.toISOString().split('T')[0]; // Format: YYYY-MM-DD
    const fullTimeStr = vnTime.toISOString().replace('T', ' ').split('.')[0];

    // 2. Cập nhật biến đếm (Total và Today)
    let total = parseInt(await db.get('views_total')) || 0;
    let today = parseInt(await db.get(`views_${todayStr}`)) || 0;

    total += 1;
    today += 1;

    await db.put('views_total', total.toString());
    await db.put(`views_${todayStr}`, today.toString());

    // 3. Ghi log truy cập
    const logEntry = `[${fullTimeStr}] IP: ${ip} | Vị trí: ${city}, ${country} | Thiết bị: ${userAgent}\n`;
    
    // Lấy log cũ ra, nối thêm log mới (giới hạn lưu 1000 dòng gần nhất để tránh tràn bộ nhớ KV)
    let currentLogs = await db.get('visitor_logs') || "";
    let logLines = currentLogs.split('\n').filter(Boolean);
    if (logLines.length > 1000) logLines.shift(); // Xóa dòng cũ nhất nếu vượt 1000
    logLines.push(logEntry);
    
    await db.put('visitor_logs', logLines.join('\n'));

    // 4. Trả về kết quả cho Frontend
    return new Response(JSON.stringify({ total: total, today: today }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    });
}
