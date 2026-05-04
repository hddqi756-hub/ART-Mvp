import React, { useState } from 'react';
import { BookOpen, Search, PenTool, Layout, Palette, Zap, Layers, Maximize, PlayCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';

interface Article {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  content: string;
  icon: React.ReactNode;
}

const KNOWLEDGE_BASE_ARTICLES: Article[] = [
  {
    id: "kb-0",
    title: "零基础弱底子：如何建立绘画的肌肉记忆",
    category: "理论基础",
    excerpt: "对于完全没有拿过画笔的人，如何在一周内建立手眼协调，摆脱“手抖”问题。",
    icon: <Zap className="w-6 h-6" />,
    content: `
# 建立肌肉记忆与观察系统

很多初学者最大的痛苦是：**脑子明白了，手不听使唤。** 下面是一套帮助你打通“眼脑手”连接的基础训练。

## 第一阶段：排线与控笔 (1周)

线条不仅仅是用来勾勒轮廓的，它是画面的第一视觉语言。

*   **不要握得太紧**：像拿筷子一样轻松地握笔，留出活动空间。
*   **发力点的转换**：
    *   **长直线**：利用**手肘**或**肩膀**发力，手腕锁定。一气呵成拉到底！
    *   **短线/细节**：利用**手腕**和**手指**发力。
*   **练习方法**：每天花15分钟在空白画布上画平行线。要求：**两头轻，中间重**。起笔有速度，收笔自然带出。

## 第二阶段：几何体概括世界 (2-3周)

我们看到的一切复杂物体，本质上都是由**球体、圆柱体和立方体**组合而成的。

> “在自然界中，一切都可以被处理成圆柱体、球体和圆锥体。” —— 保罗·塞尚

1.  **观察法**：把面前的马克杯看作圆柱体，加上一个半圆形的把手。把人的大腿看作带有微小弧度的圆柱体。
2.  **空间意识**：画这些几何体时，必须想象它的“背面”。只有在纸上建立起三维坐标系，你的画才不会是平的。

## 第三阶段：盲画法练习

这是一种极限挑战，旨在打破你的“固有认知”。

*   **规则**：眼睛死死盯着参考图的轮廓边缘，手在画板上跟着眼睛的速度移动，**全程绝对不要看画纸！**
*   **目的**：强迫你的大脑处理真实的视觉信号，而不是你潜意识里认为的符号（比如潜意识认为眼睛就是一条弧线加一个圆圈，导致画出来很生硬）。
    `
  },
  {
    id: "kb-1",
    title: "素描核心奥秘：告别纸片人与塑料感",
    category: "素描",
    excerpt: "画面总是感觉很平？立体感的唯一来源就是光与影的逻辑。",
    icon: <Maximize className="w-6 h-6" />,
    content: `
# 光影的魔法：三大面与五大调

为什么很多二次元画师在遇到了瓶颈期后，都会回去重新画石膏体？因为**素描是一切造型艺术的基础**。

## 认识三大面

形体在光照下，最基本的状态切割：
1.  **受光面（亮面）**：直接面对光源的区域。
2.  **背光面（暗面）**：光线无法直接到达的区域。
3.  **侧光面（灰面）**：光线倾斜照射的过渡区域。

只要一张画明确分出了这三个面，立体感就能立刻显现。

## 进阶：五大调子详解

在塑造具体体积时，我们需要更细腻的切分：

1.  **高光 (Highlight)**：物体表面把光源最直接反射到你眼中的那个点。材质越光滑，高光越锐利（比如金属）。
2.  **亮灰部 (Light/Halftone)**：受光面中除了高光之外的区域。它展示了物体的固有色。
3.  **明暗交界线 (Terminator)**：这是画面中最核心、最关键的地方！它是亮部与暗部的转折处。它**绝对不是一条死线**，而是一个有宽窄、有虚实起伏的面！**刻画质感，80%的精力要用在明暗交界线上。**
4.  **反光 (Reflected Light)**：暗部受到周围环境（比如桌面、其他物体）反射光的影响而微微亮起的区域。**警告：反光再亮，也绝对不能亮过灰面！哪怕是极微弱的灰面！**
5.  **投影 (Cast Shadow)**：遮挡光线后落在其他平面上的影子。靠近物体的影子最黑最实，越往远处越虚、越淡。

## 闭坑指南

*   **脏/灰**：不敢加深暗部，或者在暗部疯狂揉擦，导致缺乏对比。
*   **油腻**：高光点得太多、太大，到处都是高光。
*   **碎**：受光面和背光面的对比不强烈，局部细节的明暗关系破坏了整体的明暗大关系。
    `
  },
  {
    id: "kb-2",
    title: "厚涂神技：从起草到细化的全流程",
    category: "厚涂/写实",
    excerpt: "厚涂并不是疯狂堆叠颜料，这是一种关于大局观与块面概括的高级技巧。",
    icon: <Layers className="w-6 h-6" />,
    content: `
# 厚涂的降维打击法

很多人尝试厚涂，最后画成了一坨马赛克，或者颜色极其浑浊。其根本原因在于：**局部陷入太早，缺乏整体明暗架构。**

## 核心法门：先块面，后细节

1.  **大色块铺底 (Blocking in)**：
    使用大号的、边缘略硬的笔刷（比如不透明度较高的水彩笔或方头笔刷）。直接用颜色切分出受光面和背光面。此时**坚决不要放大画布！坚决不要画眼睛的高光！**
2.  **融合与过渡 (Blending)**：
    利用颜色拾取工具（Alt键吸色），在两个色块的交界处吸取中间色，进行过渡。或者使用带有混色功能的笔刷。
3.  **边缘控制 (Edges control)**：
    极其重要！厚涂没有线稿，我们依靠边缘的**虚（软边）**和**实（硬边）**来区分结构和材质。
    *   **硬边**：不同物体的交界（比如衣服和皮肤）、强烈的转折（比如下颌骨）。
    *   **软边**：平缓的曲面过渡（比如脸颊圆润的肉）。

## 避免画面显“脏”的终极法则

*   **明度优先于色彩**：颜色脏，其实是明暗关系错乱了。如果在灰暗的环境里放一个明度极高的颜色，就会显得很突兀（发光或者脏）。你可以新建一个全黑的图层，将混合模式改为“颜色”，随时检查你的黑白灰关系。
*   **避免使用纯黑纯白**：自然界中几乎不存在纯正的 RGB(0,0,0) 或 (255,255,255)。
    *   需要黑色阴影？用极深的紫蓝色或红棕色代替。
    *   需要白色高光？用极浅的偏黄色或偏蓝色代替。
*   **环境色的引入**：在暗部的反光区域，稍微加入一点背景的颜色。这样主体就能与环境完美融合，不会像贴上去的一样。

## 推荐练习

*   黑白灰单色厚涂石膏像（强制训练明度控制）。
*   大师油画临摹（不用画得很细，学习大师的色块切分）。
    `
  },
  {
    id: "kb-3",
    title: "赛璐璐与日系插画：极致的张力",
    category: "赛璐璐",
    excerpt: "动漫工业的结晶。如何用极简的阴影和精准的闭合线稿产生极强的故事感。",
    icon: <PenTool className="w-6 h-6" />,
    content: `
# 日系赛璐璐：线的舞蹈与光的切割

赛璐璐（Celluloid）原指动画制作中使用的透明胶片。现代插画中的“赛璐璐风格”，代表着清晰锐利的线稿、平整的底色以及边缘极度明确的两分明暗。

## 灵魂元素一：拥有生命的线稿

在赛璐璐中，线不是死的轮廓，它是活的。

*   **闭合性**：为了方便魔棒工具选区填色，线稿必须是闭合的。
*   **粗细变化（呼吸感）**：
    *   **外粗内细**：角色最外侧的轮廓线要粗，内部细微结构（如衣服褶皱尖端、发丝内部）要细。
    *   **交界处加粗**：线条相交的“死角”（如腋下、下巴接脖子处），需要人为加粗涂黑，形成一种“卡点”的张力（也叫闭塞阴影）。
*   **颜色调整**：不要全篇用纯黑线！皮肤周围的线修改为暗红色/暗橘色；蓝衣服周围的线修改为深蓝色。这叫“线稿融入”。

## 灵魂元素二：二分明暗法

这是让画面瞬间具备动画感的核心。

*   **锐利的阴影边缘**：用不带任何羽化的硬笔刷去画阴影。把复杂的立体物体极度简化为“受光面”和“背光面”。
*   **头发阴影的设计**：日系插画中，头发阴影有极强的图形设计感。比如经典的“M”型或锯齿状阴影。
*   **明暗交界线的点缀**：在受光区和阴影区的硬边缘交界处，画一条高饱和度、高明度的细线（比如橙红色）。这能模拟强光在皮肤下的半透明漫反射（次表面散射），整个画面瞬间充满活力和透明感！

## 色彩搭配逻辑

日系审美倾向于“清透”。
*   降低暗部的混浊感：阴影不要往黑色方向偏，而是改变色相（比如底色偏黄，阴影可以偏紫红）。
*   大面积的高明度亮色 + 小面积的高饱和度作为视觉中心点聚焦。
    `
  },
  {
    id: "kb-4",
    title: "半厚涂：目前最流行的降维打击技法",
    category: "半厚涂",
    excerpt: "结合了线稿的精美与厚涂的立体感。商稿与同人图中最高效的万能画法。",
    icon: <Palette className="w-6 h-6" />,
    content: `
# 半厚涂：在秩序与混沌中找到平衡

如果你觉得赛璐璐不够立体，而纯厚涂又太费力、容易糊，那么“半厚涂”就是当前插画工业界的最优解。

## 半厚涂的核心思想：线面结合

你不再需要极其完美的线稿，底色铺设后，我们将线稿也视为一种色块进行改造。

1.  **线稿颜色的弱化**：锁定线稿透明度，改变线条颜色。让线条的颜色比它周围的底色稍暗、色相稍偏冷/暖即可。只要它不再是黑色，它就从“轮廓”变成了“暗部边缘”。
2.  **受光面保线，暗部融线**：
    *   迎着光的地方，保留线稿的精妙转折，里面只做轻微的调子过渡（保留平面的清透感）。
    *   背向光的地方（暗部），可以直接新建图层，用厚涂笔刷把线稿覆盖掉，甚至直接在暗部里融入环境光。

## 刻画的优先级（视觉引导）

半厚涂极其吃“大局观”，学会“该精的精，该放的放”。

*   **最高优先级（极度精细）**：面部区域，尤其是眼睛、鼻头、嘴唇。这里要用厚涂的笔刷柔和过渡所有的转折，质感要拉满（高光、通透感）。
*   **中优先级**：离面部较近的配饰、胸前衣服的关键褶皱。保留线稿，做简单的二分明暗 + 简单的暗部渐变。
*   **低优先级（极度概括）**：背景、远处的头发、脚底。可以直接大笔刷扫过，连线稿都不用保留完整，人为制造“虚焦”景深的镜头感。

## 给新手的一句话
半厚涂不是让你随便画一个草稿然后拿颜色去盖。你的底层结构和透视必须是准确的。颜色只是包装，**结构不严谨，怎么半厚涂都很奇怪！**
    `
  },
  {
    id: "kb-5",
    title: "人体结构：从透视到动态张力",
    category: "人体结构",
    excerpt: "画人体总是看起来像僵尸？掌握脊柱的扭转与三大体块的关系。",
    icon: <PlayCircle className="w-6 h-6" />,
    content: `
# 唤醒人体的生命力：关键动态线

画人体的目的不是画一本医学图册，而是为了传达角色的动态、情感与力量。第一步永远是**动态线（Line of Action）**。

## 核心支架：三大体块与弹簧脊柱

人体躯干无论怎么运动，实际上只有三个大块面在发生空间关系：骨盆、胸腔、头部。

1.  **胸腔（蛋形）与骨盆（碗形）的博弈**：
    这就是全部的核心！想象胸腔和骨盆之间连着一根弹簧（脊柱）。当角色产生动作时，这两个体块必然产生**挤压、拉伸、扭转**。
    *   *错误画法*：无论什么动作，胸腔的正中线和骨盆的正中线都在一条直线上（僵尸站立）。
    *   *正确画法*：肩膀的倾斜线（穿过两个锁骨）与胯部的倾斜线（穿过两个大转子）大多呈现“相反”的趋势。也就是经典的**对立式平衡（Contrapposto）**。

## 头身比常识（常见应用）

*   **6头身（少年/少女）**：躯干比成年人短，头显大，二次元中非常常见，显得可爱活泼。
*   **7.5 - 8头身（标准写实/青年）**：重心在大腿根部下方一点点，修长匀称。
*   **8.5 - 9头身（大长腿/时尚插画/游戏原画）**：人为拉长腿部，视觉冲击力极强，通常强调气势。

## 重心测试

画完一个人体草图后，从角色的**锁骨正中（胸骨窝）**垂直画一条线向下。
如果这条垂直线稳稳地落在了受力腿的脚踝之间（或双脚支撑面内），那么人体就是稳的。如果偏移出了这个落脚范围，角色在视觉上就会显得要摔倒。

## 练习建议

不要一上来就临摹复杂的肌肉猛男。去搜索运动员的动态图片，用最快的时间（30秒内），画出他们的动态线和三大体块的盒子！这就够了！
    `
  }
];

const CATEGORIES = ["全部", "理论基础", "素描", "厚涂/写实", "半厚涂", "二次元/日系", "赛璐璐", "人体结构"];

export function KnowledgeBase() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("全部");
  const [selectedArticle, setSelectedArticle] = useState<Article | KNOWLEDGE_BASE_ARTICLES[0]>(KNOWLEDGE_BASE_ARTICLES[0]);

  const filteredArticles = KNOWLEDGE_BASE_ARTICLES.filter(article => {
    const matchSearch = article.title.toLowerCase().includes(search.toLowerCase()) || 
                       article.content.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "全部" || article.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="max-w-[1400px] w-full mx-auto pb-12 flex flex-col h-[calc(100vh-6rem)]">
      <div className="mb-8 px-4 lg:px-8">
        <h1 className="text-6xl font-black tracking-tighter">KNOWLEDGE<span className="text-correction underline">.</span><span className="text-white">BASE</span></h1>
        <p className="text-base font-bold text-white/60 uppercase tracking-widest mt-4 border-l-4 border-correction pl-4">系统化绘画理论与技术全解。点击左侧目录进行深度学习与研究。</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 flex-1 overflow-hidden px-4 lg:px-8">
        
        {/* Left Side: Directory & List */}
        <div className="w-full lg:w-1/3 flex flex-col h-full bg-[#111] shadow-2xl relative overflow-hidden rounded-sm hover:-translate-y-1 transition-transform border border-glass/50">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-[0.02] blur-[100px] pointer-events-none" />
          
          <div className="p-8 border-b border-glass/30 sticky top-0 bg-[#111]/90 backdrop-blur-md z-10">
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
              <input 
                type="text" 
                placeholder="搜索教程、理论、技法..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0A0A0A] border-b-2 border-glass/30 text-white pl-12 pr-4 py-4 text-sm md:text-base focus:outline-none focus:border-correction transition-colors font-mono"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 text-xs md:text-sm font-bold uppercase tracking-widest transition-all ${
                    activeCategory === cat 
                      ? 'bg-correction text-black shadow-[0_0_15px_rgba(255,77,0,0.4)]' 
                      : 'bg-[#1a1a1a] text-white/60 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-glass/30 custom-scrollbar">
            {filteredArticles.length > 0 ? (
              filteredArticles.map(article => (
                <button
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`w-full text-left p-8 transition-all hover:bg-white/[0.03] group ${
                    selectedArticle?.id === article.id ? 'bg-white/[0.05] border-l-4 border-correction' : 'border-l-4 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`transition-colors ${selectedArticle?.id === article.id ? 'text-correction' : 'text-white/40 group-hover:text-correction/50'}`}>
                      {article.icon}
                    </span>
                    <span className="text-xs font-black uppercase tracking-widest text-[#666]">{article.category}</span>
                  </div>
                  <h3 className={`font-black text-xl lg:text-2xl uppercase tracking-tight mb-3 leading-tight transition-colors ${selectedArticle?.id === article.id ? 'text-correction' : 'text-white/90 group-hover:text-white'}`}>
                    {article.title}
                  </h3>
                  <p className="text-sm text-white/50 line-clamp-3 leading-loose font-medium">{article.excerpt}</p>
                </button>
              ))
            ) : (
              <div className="p-12 text-center text-white/40 text-sm font-bold uppercase tracking-widest">
                未找到匹配的知识内容.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Article Reader */}
        <div className="w-full lg:w-2/3 flex flex-col h-full bg-[#0A0A0A] shadow-2xl relative border border-glass/30 rounded-sm">
          {selectedArticle ? (
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedArticle.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                className="flex-1 overflow-y-auto p-10 lg:p-16 custom-scrollbar"
              >
                <div className="mb-12 pb-10 border-b border-white/10">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="px-4 py-1 bg-white/5 text-sm font-bold uppercase tracking-widest text-correction border border-white/10">
                      {selectedArticle.category}
                    </span>
                  </div>
                  <h1 className="text-4xl lg:text-5xl font-black tracking-tight mb-6 text-white leading-tight">
                    {selectedArticle.title}
                  </h1>
                </div>
                <div className="markdown-body">
                  <Markdown components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-tighter text-white mt-16 mb-8 border-b border-glass pb-4 flex items-center" {...props}><div className="w-2 h-10 bg-correction mr-4 inline-block"></div>{props.children}</h1>,
                    h2: ({node, ...props}) => <h2 className="text-2xl lg:text-3xl font-black uppercase tracking-tighter text-white/90 mt-12 mb-8 border-l-[6px] border-correction pl-5 bg-white/5 py-2 inline-block w-full" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-xl lg:text-2xl font-bold text-white mt-10 mb-6" {...props} />,
                    p: ({node, ...props}) => <p className="text-base lg:text-lg text-white/80 leading-relaxed mb-8 font-medium" {...props} />,
                    ul: ({node, ...props}) => <ul className="list-disc list-outside ml-6 space-y-4 mb-10 text-white/80 text-base lg:text-lg" {...props} />,
                    ol: ({node, ...props}) => <ol className="list-decimal list-outside ml-8 space-y-5 mb-10 text-correction font-black text-lg lg:text-xl" {...props} />,
                    li: ({node, ...props}) => (
                      <li className="text-base lg:text-lg text-white/80 leading-relaxed marker:text-correction pl-2">
                        <span className="text-white/80 font-medium">{props.children}</span>
                      </li>
                    ),
                    strong: ({node, ...props}) => <strong className="text-white font-black bg-correction/20 px-2.5 py-0.5 mx-1 border-b border-correction" {...props} />,
                    blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-correction pl-6 py-4 italic text-white/70 bg-white/5 my-8 text-lg font-medium shadow-inner" {...props} />
                  }}>
                    {selectedArticle.content}
                  </Markdown>
                </div>
              </motion.div>
            </AnimatePresence>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-white/20 p-8">
               <BookOpen className="w-32 h-32 mb-8 opacity-20" />
               <p className="text-lg font-bold uppercase tracking-widest">请在左侧选择一篇教程进行深度学习</p>
             </div>
          )}
        </div>

      </div>
    </div>
  );
}
