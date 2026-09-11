const fs = require('fs');
const path = require('path');

const QUOTES = [
  { text: "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.", author: "Martin Fowler" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Experience is the name everyone gives to their mistakes.", author: "Oscar Wilde" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", author: "Cory House" },
  { text: "Simplicity is prerequisite for reliability.", author: "Edsger W. Dijkstra" },
  { text: "Make it work, make it right, make it fast.", author: "Kent Beck" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Architecture is about the important stuff. Whatever that is.", author: "Ralph Johnson" }
];

function getVietnamDate() {
  // Current UTC time + 7 hours
  const now = new Date();
  const utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
  return new Date(utcTime + (7 * 3600000));
}

function getGreeting(hour) {
  if (hour >= 5 && hour < 12) {
    return "🌅 **Chào buổi sáng!** Chúc bạn một ngày mới tràn đầy năng lượng & sáng tạo!";
  } else if (hour >= 12 && hour < 18) {
    return "☀️ **Chào buổi chiều!** Chúc bạn làm việc hiệu quả & giải quyết bài toán mượt mà!";
  } else if (hour >= 18 && hour < 23) {
    return "🌆 **Chào buổi tối!** Chúc bạn có thời gian thư giãn tuyệt vời!";
  } else {
    return "🌙 **Cú đêm coding!** Đừng quên giữ gìn sức khỏe và nghỉ ngơi hợp lý nhé!";
  }
}

function getDayName(dayIndex) {
  const days = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
  return days[dayIndex];
}

function padZero(num) {
  return String(num).padStart(2, '0');
}

function generateRealtimeContent() {
  const vnTime = getVietnamDate();
  const hours = vnTime.getHours();
  const greeting = getGreeting(hours);
  const dayStr = getDayName(vnTime.getDay());
  
  const timeStr = `${padZero(hours)}:${padZero(vnTime.getMinutes())}:${padZero(vnTime.getSeconds())}`;
  const dateStr = `${padZero(vnTime.getDate())}/${padZero(vnTime.getMonth() + 1)}/${vnTime.getFullYear()}`;
  
  const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

  const timeBadge = encodeURIComponent(`${timeStr} (GMT+7)`).replace(/-/g, '--');
  const dateBadge = encodeURIComponent(`${dayStr}, ${dateStr}`).replace(/-/g, '--');

  return `<!-- REALTIME_START -->
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/🟢_LIVE_STATUS-ONLINE-success?style=flat-square&color=10B981" alt="Live Status" />
        &nbsp;
        <img src="https://img.shields.io/badge/⏰_GIỜ_VIỆT_NAM-${timeBadge}-6366F1?style=flat-square" alt="Vietnam Time" />
        &nbsp;
        <img src="https://img.shields.io/badge/📅_NGÀY-${dateBadge}-3B82F6?style=flat-square" alt="Date" />
        <br/><br/>
        <p><i>${greeting}</i></p>
        <p>💡 “${randomQuote.text}” — <b>${randomQuote.author}</b></p>
        <sub style="color: #94A3B8;">⚡ Tự động cập nhật qua GitHub Actions • Cập nhật lần cuối: <b>${dateStr} ${timeStr} (GMT+7)</b></sub>
      </td>
    </tr>
  </table>
</div>
<!-- REALTIME_END -->`;
}

function updateReadme() {
  const readmePath = path.join(__dirname, '..', 'README.md');
  let content = fs.readFileSync(readmePath, 'utf8');

  const newRealtimeBlock = generateRealtimeContent();
  const pattern = /<!-- REALTIME_START -->[\s\S]*?<!-- REALTIME_END -->/;

  if (pattern.test(content)) {
    content = content.replace(pattern, newRealtimeBlock);
  } else {
    // Insert right after the top header & social links block
    if (content.includes('</div>\n\n---')) {
      content = content.replace('</div>\n\n---', `</div>\n\n${newRealtimeBlock}\n\n---`);
    } else {
      content = `${newRealtimeBlock}\n\n${content}`;
    }
  }

  fs.writeFileSync(readmePath, content, 'utf8');
  console.log(`✅ Successfully updated README.md with real-time stats (GMT+7)!`);
}

updateReadme();
