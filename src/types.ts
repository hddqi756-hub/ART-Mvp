export type Difficulty = '初级' | '中级' | '高级';
export type DrawingCategory = '二次元/日系' | '厚涂/写实' | '半厚涂' | '赛璐璐' | '概念原画' | '速写/线稿' | '素描' | '水彩' | '人体结构' | '肌肉解剖';
export type EditMode = 'none' | 'global' | 'local';

export interface AppSettings {
  apiKey: string;
  baseUrl: string;
  visionModel: string;
  editModel: string;
  enableWebSearch: boolean;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  criteria: string[];
  difficulty: Difficulty;
  coverImage?: string;
}

export interface PracticeCard {
  title: string;
  task: string;
  reason: string;
}

export interface Feedback {
  score: number;
  overall: string;
  strengths: string[];
  weaknesses: string[];
  explanations: string[];
  knowledgePoints: string[];
  practiceCards: PracticeCard[];
  editSuggestions?: string;
  editedImageUrl?: string; // Optional generated image
}

export interface Submission {
  id: string;
  assignmentId: string;
  imageUrl: string;
  status: 'pending' | 'grading' | 'graded';
  feedback?: Feedback;
  submittedAt: string;
  category?: DrawingCategory;
  editMode?: EditMode;
  parentSubmissionId?: string; // For secondary feedback (revision)
  revisionCount?: number;
}


export const MOCK_ASSIGNMENTS: Assignment[] = [
  {
    id: 'a1',
    title: '角色基础：头部透视与比例',
    description: '本次任务旨在训练你对人类头骨结构和面部基础比例（三庭五眼）的掌握。请绘制一个标准正视图和一个3/4侧视图的人物头像。你需要清晰地标出辅助线，并在刻画五官时注意眼球的球体结构以及鼻子的三角锥体感。不需要上色，使用素描或者线稿表现即可。',
    criteria: [
      '面部比例必须严格遵循“三庭五眼”法则',
      '两只眼睛的大小、高度、间距（约一只眼的宽度）需绝对对称',
      '在3/4侧视图中，远端的眼睛和脸颊需要有正确的透视压缩',
      '头骨后脑勺区域（颅穹窿）不可画得过平，需体现出体积',
      '下颌骨转折清晰，颈部圆柱体与头部的穿插关系准确'
    ],
    difficulty: '初级',
    coverImage: 'https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'a2',
    title: '空间与透视：一点透视与两点透视室内场景',
    description: '透视是一切立体感的基础。请以“画师的卧室”为主题，绘制一张室内场景。前半部分场景使用一点透视表现纵深，后半部分场景通过摆放倾斜的家具（如斜放的椅子或摊开的书本）引入两点透视。必须用尺子或拉线工具辅助，确保所有透视线绝对精准。',
    criteria: [
      '所有一点透视物体的纵深线必须精准汇成一个【消失点】',
      '画面中摆放的倾斜物体（两点透视）具有独立的消失点，但都处于同一个【视平线】上',
      '近大远小的比例缩放感强烈，不能出现透视畸变反转',
      '场景中存在相互遮挡关系，增强空间层次',
      '线稿需做到“近实远虚、近粗远细”的空间虚实变化'
    ],
    difficulty: '中级',
    coverImage: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'a3',
    title: '人体动态速写：极限张力捕捉',
    description: '抛弃那些僵硬的立绘站姿！本次任务要求你画出一个处于极其激烈运动中的角色（如挥剑劈砍、躲避爆炸跃向空中、拉满弓箭）。不要画五官和衣服褶皱，将全部精力集中在【动态线】与【三大体块】（头部、胸腔、骨盆）的剧烈扭转上。',
    criteria: [
      '贯穿全身的动态线（Line of Action）必须流畅且呈现强势的S型或C型弧线',
      '胸腔（蛋形结构）与骨盆（碗型结构）之间必须产生清晰的【扭转】与【挤压拉伸】',
      '重心位置必须合理支撑整个动作（或处于合理的受力失衡下落瞬间）',
      '四肢的透视缩截（Foreshortening）不显生硬，具有镜头冲击力',
      '舍弃无关细节，线条具有速度感与爆发力'
    ],
    difficulty: '高级',
    coverImage: 'https://images.unsplash.com/photo-1547826039-bfc35e0f1ea8?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'a4',
    title: '光影魔法：单光源几何体与静物素描',
    description: '素描是一切上色的地基。请设立一个明确的左上角单光源，绘制一组摆在一起的几何体（石膏球体、圆柱体、六棱柱）。请使用软硬不同的画笔，深刻表现出三大面（亮、灰、暗）与五大调子（高光、亮灰、明暗交界线、反光、投影）。',
    criteria: [
      '光影逻辑严密，受光面、背光面、侧光面必须能第一眼区分',
      '【明暗交界线】绝对不是一条死线，而是必须有宽窄、虚实变化的转折面',
      '球体的明暗交界线弧度必须顺应其体积规律',
      '暗部【反光】的明度绝对不可高于亮部最深的灰面（不可画得像发光体）',
      '【投影】需遵循“近实远虚”，离物体越远投影越虚化且颜色变浅'
    ],
    difficulty: '中级',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: 'a5',
    title: '色彩与材质：金属与玻璃的质感表达',
    description: '材质表达是进阶画师的重要大关。请尝试绘制一把沾了血迹的生锈铁剑，以及一瓶装着发光蓝色液体的透明玻璃药水瓶。重点在于区分不同材质对光的反射、折射率完全不同这一物理属性。',
    criteria: [
      '金属质感的高光点必须“高度集中且极其锐利”，反差极其强烈',
      '生锈区域的反射必须变为漫反射（软边阴影与粗糙颗粒感）',
      '玻璃瓶身需重点刻画【边缘高光】与【透光反光】（折射现象）',
      '玻璃内部的液体要有通透感与焦散光斑（Caustics）',
      '整体画面需受所设定光源的统一影响，色彩不应出现脏、灰感'
    ],
    difficulty: '高级',
    coverImage: 'https://images.unsplash.com/photo-1507643179773-3e975d7ac515?auto=format&fit=crop&q=80&w=400',
  }
];
