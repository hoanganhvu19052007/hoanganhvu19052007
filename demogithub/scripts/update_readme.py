import re
import random
from datetime import datetime, timezone, timedelta

QUOTES = [
    ("“Any fool can write code that a computer can understand. Good programmers write code that humans can understand.”", "Martin Fowler"),
    ("“First, solve the problem. Then, write the code.”", "John Johnson"),
    ("“Experience is the name everyone gives to their mistakes.”", "Oscar Wilde"),
    ("“Code is like humor. When you have to explain it, it’s bad.”", "Cory House"),
    ("“Simplicity is prerequisite for reliability.”", "Edsger W. Dijkstra"),
    ("“Make it work, make it right, make it fast.”", "Kent Beck"),
    ("“The best error message is the one that never shows up.”", "Thomas Fuchs"),
    ("“Architecture is about the important stuff. Whatever that is.”", "Ralph Johnson"),
]

def get_vietnam_time():
    # GMT+7
    tz_vietnam = timezone(timedelta(hours=7))
    return datetime.now(tz_vietnam)

def get_greeting(hour: int) -> str:
    if 5 <= hour < 12:
        return "🌅 **Chào buổi sáng!** Chúc bạn một ngày mới tràn đầy năng lượng & sáng tạo!"
    elif 12 <= hour < 18:
        return "☀️ **Chào buổi chiều!** Chúc bạn làm việc hiệu quả & giải quyết bài toán mượt mà!"
    elif 18 <= hour < 23:
        return "🌆 **Chào buổi tối!** Chúc bạn có thời gian thư giãn tuyệt vời!"
    else:
        return "🌙 **Cú đêm coding!** Đừng quên giữ gìn sức khỏe và nghỉ ngơi hợp lý nhé!"

def get_day_name(weekday: int) -> str:
    days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"]
    return days[weekday]

def generate_realtime_content() -> str:
    now = get_vietnam_time()
    greeting = get_greeting(now.hour)
    day_str = get_day_name(now.weekday())
    time_str = now.strftime("%H:%M:%S")
    date_str = now.strftime("%d/%m/%Y")
    
    quote_text, quote_author = random.choice(QUOTES)
    
    # URL encoded time badge
    time_badge_label = f"{time_str} (GMT+7)".replace("-", "--").replace(" ", "%20")
    date_badge_label = f"{day_str}, {date_str}".replace("-", "--").replace(" ", "%20")

    content = f"""<!-- REALTIME_START -->
<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://img.shields.io/badge/🟢_LIVE_STATUS-ONLINE-success?style=flat-square&color=10B981" alt="Live Status" />
        &nbsp;
        <img src="https://img.shields.io/badge/⏰_GIỜ_VIỆT_NAM-{time_badge_label}-6366F1?style=flat-square" alt="Vietnam Time" />
        &nbsp;
        <img src="https://img.shields.io/badge/📅_NGÀY-{date_badge_label}-3B82F6?style=flat-square" alt="Date" />
        <br/><br/>
        <p><i>{greeting}</i></p>
        <p>💡 {quote_text} — <b>{quote_author}</b></p>
        <sub style="color: #94A3B8;">⚡ Tự động cập nhật qua GitHub Actions • Cập nhật lần cuối: <b>{date_str} {time_str} (GMT+7)</b></sub>
      </td>
    </tr>
  </table>
</div>
<!-- REALTIME_END -->"""
    return content

def update_readme():
    readme_path = "README.md"
    with open(readme_path, "r", encoding="utf-8") as f:
        content = f.read()

    new_realtime_block = generate_realtime_content()
    pattern = r"<!-- REALTIME_START -->.*?<!-- REALTIME_END -->"

    if re.search(pattern, content, flags=re.DOTALL):
        updated_content = re.sub(pattern, new_realtime_block, content, flags=re.DOTALL)
    else:
        # If not present, insert below the quick social links or header
        if "</div>\n\n---" in content:
            updated_content = content.replace("</div>\n\n---", f"</div>\n\n{new_realtime_block}\n\n---", 1)
        else:
            updated_content = new_realtime_block + "\n\n" + content

    with open(readme_path, "w", encoding="utf-8") as f:
        f.write(updated_content)

    print(f"Successfully updated README.md with real-time stats at {get_vietnam_time().strftime('%Y-%m-%d %H:%M:%S (GMT+7)')}")

if __name__ == "__main__":
    update_readme()
