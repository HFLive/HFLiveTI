export const questions = [
  {
    id: "q1",
    text: "体育课自由活动，你会选：",
    options: [
      { id: "a", text: "跟同学打半场球", weights: [0, 1, 2, 0], lead: 0 },
      { id: "b", text: "和朋友绕操场聊天", weights: [1, 0, 0, 2], lead: 0 },
      { id: "c", text: "自己练投篮、颠球或发球", weights: [0, 2, 0, 1], lead: 0 },
      { id: "d", text: "坐在旁边看别人比赛", weights: [2, 0, 1, 0], lead: 0 },
    ],
  },
  {
    id: "q2",
    text: "四个人点奶茶，群里一直定不下来。你会：",
    options: [
      { id: "a", text: "发四家店让大家投票，三分钟后下单", weights: [1, 1, 1, 1], lead: 2 },
      { id: "b", text: "删掉配送太久的店，再选评分最高的", weights: [1, 2, 0, 0], lead: 1 },
      { id: "c", text: "跟着票数最多的人点同款", weights: [1, 0, 2, 0], lead: 0 },
      { id: "d", text: "单点自己平时常喝的那杯", weights: [0, 0, 1, 2], lead: 0 },
    ],
  },
  {
    id: "q3",
    text: "新游戏第一次组队，你更常：",
    options: [
      { id: "a", text: "看攻略，记三条关键机制", weights: [0, 2, 0, 1], lead: 0 },
      { id: "b", text: "开麦报位置和倒计时", weights: [0, 1, 2, 0], lead: 0 },
      { id: "c", text: "录下翻车片段做梗图", weights: [2, 0, 1, 0], lead: 0 },
      { id: "d", text: "先逛地图，找隐藏区域", weights: [1, 0, 0, 2], lead: 0 },
    ],
  },
  {
    id: "q4",
    text: "等电影开场还有四十分钟，你会：",
    options: [
      { id: "a", text: "找海报墙拍几张合照", weights: [2, 0, 1, 0], lead: 0 },
      { id: "b", text: "看楼层图，排一条逛店路线", weights: [1, 1, 1, 1], lead: 2 },
      { id: "c", text: "买好爆米花，再确认检票口和时间", weights: [0, 2, 1, 0], lead: 1 },
      { id: "d", text: "找个位置坐下看预告片", weights: [1, 0, 0, 2], lead: 0 },
    ],
  },
  {
    id: "q5",
    text: "四个人出去玩，想拍一段小视频。你先说：",
    options: [
      { id: "a", text: "选一首大家都熟的歌", weights: [0, 1, 2, 0], lead: 0 },
      { id: "b", text: "多拍几个角度，回去再选", weights: [2, 1, 0, 0], lead: 1 },
      { id: "c", text: "找个背景干净的位置", weights: [1, 0, 0, 2], lead: 0 },
      { id: "d", text: "说好谁拿手机、谁站哪里", weights: [1, 1, 1, 1], lead: 2 },
    ],
  },
  {
    id: "q6",
    text: "朋友生日聚会，你提前二十分钟到了。你会：",
    options: [
      { id: "a", text: "把零食和饮料按人数摆好", weights: [0, 2, 0, 1], lead: 1 },
      { id: "b", text: "在群里发房间号，确认谁还没到", weights: [1, 1, 1, 1], lead: 2 },
      { id: "c", text: "选一首寿星进门时播放的歌", weights: [0, 0, 2, 1], lead: 0 },
      { id: "d", text: "拍张现场图发群里提醒位置", weights: [2, 1, 0, 0], lead: 0 },
    ],
  },
  {
    id: "q7",
    text: "同学参加一百米比赛，你在看台会：",
    options: [
      { id: "a", text: "从起跑一直拍到终点", weights: [2, 0, 1, 0], lead: 0 },
      { id: "b", text: "看赛程表，提醒他什么时候去检录", weights: [0, 2, 0, 1], lead: 0 },
      { id: "c", text: "冲刺时和大家一起喊加油", weights: [1, 0, 2, 0], lead: 0 },
      { id: "d", text: "提前找一个能看清终点的位置", weights: [0, 1, 0, 2], lead: 0 },
    ],
  },
  {
    id: "q8",
    text: "跟朋友出去玩，临时多出一小时，你更想：",
    options: [
      { id: "a", text: "拍大头贴或逛照相馆", weights: [2, 0, 0, 1], lead: 0 },
      { id: "b", text: "玩桌游、密室或街机", weights: [1, 2, 0, 0], lead: 0 },
      { id: "c", text: "唱歌或听一场小型演出", weights: [0, 1, 2, 0], lead: 0 },
      { id: "d", text: "逛展、看夜景或逛家居店", weights: [0, 0, 1, 2], lead: 0 },
    ],
  },
  {
    id: "q9",
    text: "课前小组汇报，电脑接上投影没画面。你会：",
    options: [
      { id: "a", text: "按连接顺序重新插一次", weights: [1, 2, 0, 0], lead: 1 },
      { id: "b", text: "让组员先讲开场，自己继续处理", weights: [1, 1, 1, 1], lead: 2 },
      { id: "c", text: "把三条重点写到黑板上", weights: [0, 0, 1, 2], lead: 0 },
      { id: "d", text: "请一位同学去找老师帮忙", weights: [1, 0, 2, 0], lead: 0 },
    ],
  },
  {
    id: "q10",
    text: "周末刷手机半小时，你更常点开：",
    options: [
      { id: "a", text: "球赛、整活或生活视频", weights: [2, 0, 0, 1], lead: 0 },
      { id: "b", text: "数码测评、设备拆解或软件教程", weights: [1, 2, 0, 0], lead: 0 },
      { id: "c", text: "新歌、翻唱或乐队现场", weights: [0, 1, 2, 0], lead: 0 },
      { id: "d", text: "桌搭、绘画或房间改造", weights: [0, 0, 1, 2], lead: 0 },
    ],
  },
  {
    id: "q11",
    text: "和朋友在跳蚤市场摆摊，快结束时还剩几样东西。你会：",
    options: [
      { id: "a", text: "清点物品，决定哪些继续卖、哪些先收起来", weights: [1, 1, 1, 1], lead: 2 },
      { id: "b", text: "拍下剩余物品发到群里", weights: [2, 0, 0, 1], lead: 0 },
      { id: "c", text: "在摊位前介绍最后几件商品", weights: [0, 1, 2, 0], lead: 1 },
      { id: "d", text: "把最显眼的物品摆到桌子前面", weights: [0, 1, 0, 2], lead: 0 },
    ],
  },
  {
    id: "q12",
    text: "看完一场演出或音乐综艺，你先聊：",
    options: [
      { id: "a", text: "哪一段最适合剪成短视频", weights: [2, 1, 0, 0], lead: 0 },
      { id: "b", text: "哪首歌现场最好听", weights: [0, 0, 2, 1], lead: 0 },
      { id: "c", text: "哪套舞台画面最好看", weights: [1, 0, 0, 2], lead: 0 },
      { id: "d", text: "道具和场景怎么换得那么快", weights: [0, 2, 1, 0], lead: 0 },
    ],
  },
  {
    id: "q13",
    text: "四个人拼一盒大型积木，你更想：",
    options: [
      { id: "a", text: "看说明书，把步骤分给大家", weights: [1, 1, 1, 1], lead: 2 },
      { id: "b", text: "拍一段从开盒到完成的延时视频", weights: [2, 0, 0, 1], lead: 0 },
      { id: "c", text: "找零件并大声报出编号", weights: [0, 0, 2, 1], lead: 0 },
      { id: "d", text: "先按颜色和形状把零件分类", weights: [0, 2, 0, 1], lead: 1 },
    ],
  },
  {
    id: "q14",
    text: "密室逃脱卡关时，你会：",
    options: [
      { id: "a", text: "翻看刚才拍下的线索照片", weights: [2, 0, 1, 0], lead: 0 },
      { id: "b", text: "按房间列出已经使用过的道具", weights: [0, 2, 1, 0], lead: 1 },
      { id: "c", text: "让每个人说说手里还有什么线索", weights: [1, 1, 1, 1], lead: 2 },
      { id: "d", text: "检查墙面图案和灯光变化", weights: [0, 1, 0, 2], lead: 0 },
    ],
  },
  {
    id: "q15",
    text: "周末空出一小时，你更想：",
    options: [
      { id: "a", text: "剪一段十五秒日常视频", weights: [2, 0, 1, 0], lead: 0 },
      { id: "b", text: "拼一个小模型或改装小物件", weights: [0, 2, 0, 1], lead: 0 },
      { id: "c", text: "做一份歌单或录段翻唱", weights: [1, 0, 2, 0], lead: 0 },
      { id: "d", text: "整理桌面并换一套配色", weights: [0, 1, 0, 2], lead: 0 },
    ],
  },
];
