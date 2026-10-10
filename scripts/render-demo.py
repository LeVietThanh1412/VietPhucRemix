"""Compose the real app recording into a three-minute subtitled MP4. No network calls."""
import json
import math
import pathlib
import re
import subprocess
from PIL import Image, ImageDraw, ImageFont

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / 'artifacts/demo-video'
SCENES = json.loads((ROOT / 'scripts/demo-story.json').read_text())
DURATIONS = [15, 18, 18, 12, 19, 16, 13, 22, 12, 14, 14, 7]
for scene, duration in zip(SCENES, DURATIONS):
    scene['duration'] = duration

W, H = 1920, 1080
BG, INK, MUTED, ACCENT = '#F6F1E9', '#24211E', '#756B61', '#98532F'
SANS = '/usr/share/fonts/noto/NotoSans-Regular.ttf'
BOLD = '/usr/share/fonts/noto/NotoSans-Bold.ttf'
SERIF = '/usr/share/fonts/noto/NotoSerif-Regular.ttf'

def font(size, style='sans'):
    return ImageFont.truetype({'sans': SANS, 'bold': BOLD, 'serif': SERIF}[style], size)

def wrap(text, limit):
    lines, line = [], ''
    for word in text.split():
        candidate = f'{line} {word}'.strip()
        if len(candidate) > limit and line:
            lines.append(line)
            line = word
        else:
            line = candidate
    if line:
        lines.append(line)
    return lines

def draw_lines(draw, lines, xy, size=30, color=INK, style='sans', spacing=1.55):
    x, y = xy
    for line in lines:
        draw.text((x, y), line, fill=color, font=font(size, style))
        y += round(size * spacing)

def base_frame(scene, index):
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 5), fill='#E5DACE')
    d.rectangle((0, 0, int(W*(index+1)/len(SCENES)), 5), fill=ACCENT)
    d.text((192, 25), scene['title'], font=font(24, 'bold'), fill=INK)
    d.text((1728, 30), 'AUDITION / DEMO', anchor='ra', font=font(18), fill=MUTED)
    d.rounded_rectangle((182, 78, 1738, 962), radius=18, fill='#DCD1C5')
    d.rounded_rectangle((150, 978, 1770, 1068), radius=14, fill=INK)
    return im

def title_card(scene, ending=False):
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    for x, y, r in [(1700, 200, 420), (1750, 850, 500), (-150, 1150, 600)]:
        d.ellipse((x-r, y-r, x+r, y+r), outline='#E8DACA', width=2)
        d.ellipse((x-r+30, y-r+30, x+r-30, y+r-30), outline='#E8DACA', width=2)
    d.text((120, 100), 'BÀI AUDITION / VIỆT PHỤC REMIX', font=font(22, 'bold'), fill=ACCENT)
    if not ending:
        draw_lines(d, ['Việt Phục', 'Remix'], (115, 255), 88, INK, 'serif', 1.4)
        d.rectangle((120, 528, 220, 534), fill=ACCENT)
        draw_lines(d, ['Khám phá di sản.', 'Phối theo cá tính.'], (120, 572), 34, INK, 'sans', 1.55)
        draw_lines(d, ['Chọn trang phục · Thử bản phối', 'Hiểu văn hóa · Chia sẻ lookbook'], (120, 765), 24, MUTED)
        screenshot = Image.open(OUT / 'studio.png').convert('RGB')
        crop = screenshot.crop((110, 163, 600, 807)).resize((590, 775))
        d.rounded_rectangle((1070, 143, 1696, 954), radius=24, fill='#D7C8B8')
        im.paste(crop, (1088, 161))
    else:
        draw_lines(d, ['Khám phá di sản,', 'phối theo cá tính.'], (115, 315), 58, INK, 'serif', 1.5)
        draw_lines(d, ['VIỆT PHỤC REMIX', 'Trải nghiệm phối Việt phục dành cho người trẻ.'], (120, 565), 27, ACCENT)
        look = Image.open(OUT / 'lookbook-demo.png').convert('RGB')
        look.thumbnail((490, 790))
        x, y = 1250, 118
        d.rounded_rectangle((x-15, y-15, x+look.width+15, y+look.height+15), radius=18, fill='#D7C8B8')
        im.paste(look, (x, y))
    d.rounded_rectangle((150, 978, 1770, 1068), radius=14, fill=INK)
    return im

def workflow_card(scene):
    im = Image.new('RGB', (W, H), BG)
    d = ImageDraw.Draw(im)
    d.text((120, 90), 'GEMINI / TỪ Ý TƯỞNG ĐẾN SẢN PHẨM', font=font(25, 'bold'), fill=ACCENT)
    d.text((120, 158), 'Prompt rõ hơn, quyết định cụ thể hơn.', font=font(48, 'serif'), fill=INK)
    boxes = [
        ('01', 'Phân tích đề bài', ['Nhu cầu học sinh, sinh viên', 'Tính năng cốt lõi và mở rộng']),
        ('02', 'Cân nhắc phương án', ['3D · Chuỗi ảnh · Sinh ảnh AI', 'Chọn 2D vector xếp lớp']),
        ('03', 'Prompt triển khai', ['Layer · State · Điều khiển', 'Quy tắc văn hóa · Responsive']),
    ]
    for i, (number, title, lines) in enumerate(boxes):
        x = 120 + i*565
        d.rounded_rectangle((x, 292, x+530, 568), radius=20, fill='#FFFCF7', outline='#D7C8B8', width=2)
        d.text((x+32, 320), number, font=font(25, 'bold'), fill=ACCENT)
        d.text((x+32, 385), title, font=font(28, 'bold'), fill=INK)
        draw_lines(d, lines, (x+32, 451), 23, MUTED)
    d.text((120, 640), 'GEMINI TRONG ỨNG DỤNG', font=font(23, 'bold'), fill=ACCENT)
    draw_lines(d, ['Câu hỏi + bản phối + dữ liệu văn hóa → máy chủ → Gemini → lời tư vấn',
                   'React / TypeScript / SVG    ·    Node.js / Express    ·    Bộ quy tắc cục bộ'], (120, 709), 27, INK)
    d.rounded_rectangle((150, 978, 1770, 1068), radius=14, fill=INK)
    return im

def run(args):
    subprocess.run(args, check=True, stdout=subprocess.DEVNULL)

def probe(path):
    return float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'default=nw=1:nk=1', str(path)]))

def stamp(seconds, srt=False):
    ms = round(seconds*1000)
    hours, ms = divmod(ms, 3600000)
    minutes, ms = divmod(ms, 60000)
    sec, ms = divmod(ms, 1000)
    return f'{hours:02}:{minutes:02}:{sec:02}{"," if srt else "."}{ms:03}'

# Captions fit into two lines below the application, so they never cover controls.
captions, elapsed = [], 0.0
for scene in SCENES:
    sentences = re.split(r'(?<=[.!?])\s+', scene['text'])
    chunks = []
    for sentence in sentences:
        words, current = sentence.split(), ''
        for word in words:
            candidate = f'{current} {word}'.strip()
            if len(candidate) > 138 and current:
                chunks.append(current)
                current = word
            else:
                current = candidate
        if current:
            chunks.append(current)
    total_words = sum(len(c.split()) for c in chunks)
    t = elapsed + 0.15
    available = scene['duration'] - 0.3
    for chunk in chunks:
        end = t + available * len(chunk.split())/total_words
        captions.append((t, end, chunk))
        t = end
    elapsed += scene['duration']

srt = '\n\n'.join(f'{i}\n{stamp(a,True)} --> {stamp(b,True)}\n'+ '\n'.join(wrap(c,78)) for i,(a,b,c) in enumerate(captions,1))+'\n'
(OUT / 'viet-phuc-remix-demo.srt').write_text(srt)
def ass_stamp(seconds):
    cs = round(seconds * 100)
    hours, cs = divmod(cs, 360000)
    minutes, cs = divmod(cs, 6000)
    sec, cs = divmod(cs, 100)
    return f'{hours}:{minutes:02}:{sec:02}.{cs:02}'

ass = '''[Script Info]
ScriptType: v4.00+
PlayResX: 1920
PlayResY: 1080
WrapStyle: 2

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Default,Noto Sans,28,&H00FFFFFF,&H00FFFFFF,&H0024211E,&H0024211E,0,0,0,0,100,100,0,0,1,1,0,2,170,170,24,1

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
'''
for a,b,c in captions:
    content = r'\N'.join(wrap(c,78))
    ass += f'Dialogue: 0,{ass_stamp(a)},{ass_stamp(b)},Default,,0,0,0,,{content}\n'
(OUT / 'viet-phuc-remix-demo.ass').write_text(ass)
(OUT / 'kich-ban-demo.md').write_text('# Việt Phục Remix — Kịch bản demo 3 phút\n\n' + '\n\n'.join(f'**{s["title"]}**\n\n{s["text"]}' for s in SCENES))

timeline = {item['id']: item for item in json.loads((OUT/'timeline.json').read_text())}
raw = pathlib.Path((OUT/'raw-video-path.txt').read_text().strip())
# The recorder retains trailing frames during close; duration minus wall time
# therefore overestimates the initial offset. Calibrated against captured UI frames.
offset = 4.0
(OUT/'render-timing.json').write_text(json.dumps({'rawOffset':offset,'scenes':SCENES},ensure_ascii=False,indent=2))
(OUT/'clips').mkdir(exist_ok=True)

for index, scene in enumerate(SCENES):
    print('RENDER', scene['id'], flush=True)
    frame = OUT / f'frame-{scene["id"]}.png'
    output = OUT / 'clips' / f'{index:02}.mp4'
    if scene['id'] == 'intro':
        title_card(scene).save(frame)
        args = ['ffmpeg','-y','-loglevel','error','-loop','1','-framerate','24','-i',str(frame),'-t',str(scene['duration'])]
    elif scene['id'] == 'outro':
        title_card(scene,True).save(frame)
        args = ['ffmpeg','-y','-loglevel','error','-loop','1','-framerate','24','-i',str(frame),'-t',str(scene['duration'])]
    elif scene['id'] == 'workflow':
        workflow_card(scene).save(frame)
        args = ['ffmpeg','-y','-loglevel','error','-loop','1','-framerate','24','-i',str(frame),'-t',str(scene['duration'])]
    else:
        base_frame(scene,index).save(frame)
        item = timeline[scene['id']]
        source_duration = item['end']-item['start']
        # Slow short clips slightly; freeze the end so viewers can read the result.
        moving_duration = min(source_duration*1.05, scene['duration']-2)
        ratio = moving_duration/source_duration
        padding = scene['duration']-moving_duration
        fc = f'[0:v]setpts=PTS-STARTPTS,{ratio:.6f}*PTS,scale=1536:864:flags=lanczos,fps=24,tpad=stop_mode=clone:stop_duration={padding:.4f}[screen];[1:v][screen]overlay=192:88:shortest=1,format=yuv420p[v]'
        # setpts accepts one expression; keep the scaling explicit.
        fc = fc.replace('setpts=PTS-STARTPTS,'+f'{ratio:.6f}*PTS',f'setpts={ratio:.6f}*(PTS-STARTPTS)')
        args = ['ffmpeg','-y','-loglevel','error','-ss',f'{item["start"]+offset:.4f}','-t',f'{source_duration:.4f}','-i',str(raw),'-loop','1','-framerate','24','-i',str(frame),'-filter_complex',fc,'-map','[v]','-t',str(scene['duration'])]
    run(args+['-an','-c:v','libx264','-preset','veryfast','-crf','19','-pix_fmt','yuv420p','-r','24','-threads','4',str(output)])

concat = OUT/'clips.txt'
concat.write_text('\n'.join("file '"+str((OUT/'clips'/f'{i:02}.mp4').resolve())+"'" for i in range(len(SCENES)))+'\n')
run(['ffmpeg','-y','-loglevel','error','-f','concat','-safe','0','-i',str(concat),'-c','copy',str(OUT/'demo-no-captions.mp4')])
sub_filter = f"ass={OUT/'viet-phuc-remix-demo.ass'}"
print('BURN CAPTIONS',flush=True)
run(['ffmpeg','-y','-loglevel','error','-i',str(OUT/'demo-no-captions.mp4'),'-vf',sub_filter,'-an','-c:v','libx264','-preset','veryfast','-crf','19','-threads','4','-pix_fmt','yuv420p','-movflags','+faststart',str(OUT/'viet-phuc-remix-demo-3-phut.mp4')])
print('DONE',probe(OUT/'viet-phuc-remix-demo-3-phut.mp4'),flush=True)
