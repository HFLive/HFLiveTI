import QRCode from "qrcode";

const CARD_WIDTH = 1080;
const CARD_HEIGHT = 1440;
const FONT_STACK =
  '"Microsoft YaHei", "PingFang SC", "Segoe UI", system-ui, sans-serif';
const MONO_STACK = 'Consolas, "SFMono-Regular", ui-monospace, monospace';

const setFont = (context, size, weight = 700, family = FONT_STACK) => {
  context.font = `${weight} ${size}px ${family}`;
};

const splitLines = (context, text, maxWidth) => {
  const lines = [];
  let current = "";

  for (const character of String(text)) {
    if (character === "\n") {
      lines.push(current);
      current = "";
      continue;
    }

    const candidate = current + character;
    if (current && context.measureText(candidate).width > maxWidth) {
      lines.push(current);
      current = character;
    } else {
      current = candidate;
    }
  }

  if (current) lines.push(current);
  return lines;
};

const drawWrappedText = (
  context,
  text,
  x,
  y,
  maxWidth,
  lineHeight,
  maxLines,
) => {
  const lines = splitLines(context, text, maxWidth).slice(0, maxLines);
  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
  return y + lines.length * lineHeight;
};

const loadImage = (source) =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("二维码图片加载失败"));
    image.src = source;
  });

const drawGrid = (context) => {
  context.save();
  context.strokeStyle = "rgba(17, 17, 15, 0.055)";
  context.lineWidth = 2;

  for (let x = 0; x <= CARD_WIDTH; x += 48) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, CARD_HEIGHT);
    context.stroke();
  }

  for (let y = 0; y <= CARD_HEIGHT; y += 48) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(CARD_WIDTH, y);
    context.stroke();
  }

  context.restore();
};

const drawRoleTags = (context, roles, startY, color) => {
  let x = 78;
  let y = startY;
  const tagHeight = 58;
  const gap = 14;

  setFont(context, 29, 800);

  for (const role of roles) {
    const width = Math.ceil(context.measureText(role).width) + 42;
    if (x + width > CARD_WIDTH - 78) {
      x = 78;
      y += tagHeight + gap;
    }

    context.fillStyle = color;
    context.fillRect(x, y, width, tagHeight);
    context.strokeStyle = "#11110f";
    context.lineWidth = 3;
    context.strokeRect(x, y, width, tagHeight);
    context.fillStyle = "#11110f";
    context.textBaseline = "middle";
    context.fillText(role, x + 21, y + tagHeight / 2 + 1);
    x += width + gap;
  }

  context.textBaseline = "alphabetic";
  return y + tagHeight;
};

export async function createShareCard({
  primary,
  secondary,
  secondaryLabel,
  shareUrl,
}) {
  if (document.fonts?.ready) await document.fonts.ready;

  const canvas = document.createElement("canvas");
  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;

  const context = canvas.getContext("2d");
  if (!context) throw new Error("当前浏览器无法生成分享图片");

  context.fillStyle = "#f3f0e8";
  context.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  drawGrid(context);

  context.fillStyle = "#ff3b30";
  context.beginPath();
  context.arc(88, 82, 13, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#11110f";
  setFont(context, 30, 900, MONO_STACK);
  context.fillText("HFLIVE", 118, 92);
  context.textAlign = "right";
  setFont(context, 23, 800, MONO_STACK);
  context.fillText("PERSONALITY SIGNAL / SHARE", 1002, 89);
  context.textAlign = "left";

  context.fillRect(78, 126, 924, 4);

  context.fillStyle = primary.color;
  context.fillRect(78, 182, 320, 64);
  context.strokeStyle = "#11110f";
  context.lineWidth = 4;
  context.strokeRect(78, 182, 320, 64);
  context.fillStyle = "#11110f";
  context.textBaseline = "middle";
  setFont(context, 28, 900, MONO_STACK);
  context.fillText(primary.group, 102, 215);
  context.textBaseline = "alphabetic";

  context.fillStyle = "#11110f";
  setFont(context, 25, 800, MONO_STACK);
  context.fillText("YOUR TEAM SIGNAL", 78, 298);

  setFont(context, 104, 950);
  const titleBottom = drawWrappedText(
    context,
    primary.title,
    72,
    414,
    900,
    112,
    2,
  );

  context.fillStyle = primary.color;
  context.fillRect(72, titleBottom - 45, 620, 30);
  context.fillStyle = "#11110f";
  setFont(context, 38, 600);
  const descriptionBottom = drawWrappedText(
    context,
    primary.description,
    78,
    titleBottom + 38,
    900,
    60,
    4,
  );

  context.fillStyle = "#11110f";
  setFont(context, 23, 800, MONO_STACK);
  context.fillText("优先体验", 78, descriptionBottom + 42);
  const rolesBottom = drawRoleTags(
    context,
    primary.roles,
    descriptionBottom + 66,
    primary.color,
  );

  const secondaryTop = Math.max(rolesBottom + 54, 940);
  context.fillStyle = "#e8e3d8";
  context.fillRect(78, secondaryTop, 924, 142);
  context.strokeStyle = "#11110f";
  context.lineWidth = 4;
  context.strokeRect(78, secondaryTop, 924, 142);
  context.fillStyle = "#11110f";
  setFont(context, 22, 800, MONO_STACK);
  context.fillText(secondaryLabel, 106, secondaryTop + 42);
  setFont(context, 39, 900);
  context.fillText(secondary.group, 106, secondaryTop + 98);

  const qrDataUrl = await QRCode.toDataURL(shareUrl, {
    errorCorrectionLevel: "M",
    margin: 0,
    width: 220,
    color: {
      dark: "#11110f",
      light: "#fffefa",
    },
  });
  const qrImage = await loadImage(qrDataUrl);

  context.fillStyle = "#fffefa";
  context.fillRect(752, 1140, 250, 250);
  context.strokeStyle = "#11110f";
  context.lineWidth = 4;
  context.strokeRect(752, 1140, 250, 250);
  context.drawImage(qrImage, 767, 1155, 220, 220);

  context.fillStyle = "#11110f";
  setFont(context, 24, 800, MONO_STACK);
  context.fillText("SCAN TO TEST", 78, 1196);
  setFont(context, 42, 900);
  context.fillText("扫码测测你适合哪个组", 78, 1264);
  setFont(context, 25, 600);
  drawWrappedText(context, shareUrl, 78, 1318, 600, 38, 2);

  context.fillRect(78, 1388, 924, 4);
  setFont(context, 20, 800, MONO_STACK);
  context.fillText("HFLIVE · LIVE TOGETHER", 78, 1423);

  return canvas.toDataURL("image/png");
}
