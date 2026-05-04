import { GoogleGenAI } from '@google/genai';
import { Assignment, Feedback, AppSettings } from '../types';

export function getAppSettings(): AppSettings {
  const defaultSettings: AppSettings = {
    apiKey: '',
    baseUrl: '',
    visionModel: 'gemini-3.1-pro-preview',
    editModel: 'gemini-2.5-flash-image',
    enableWebSearch: true,
  };
  const saved = localStorage.getItem('artify_settings');
  return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
}

export function saveAppSettings(settings: AppSettings) {
  localStorage.setItem('artify_settings', JSON.stringify(settings));
}

export function extractBase64Data(dataUrl: string) {
  const matches = dataUrl.match(/^data:(.+);base64,(.+)$/);
  if (!matches || matches.length !== 3) {
    throw new Error('Invalid base64 image data');
  }
  return {
    mimeType: matches[1],
    data: matches[2]
  };
}

export async function gradeDrawing(
  imageUrl: string, 
  assignment: Assignment, 
  category?: string,
  editMode: 'none' | 'global' | 'local' = 'none'
): Promise<Feedback> {
  const settings = getAppSettings();
  const apiKey = settings.apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('未配置 Gemini API Key，请在设置中添加。');
  }

  const ai = new GoogleGenAI(
    settings.baseUrl ? { apiKey, httpOptions: { baseUrl: settings.baseUrl } } : { apiKey }
  );
  const { mimeType, data } = extractBase64Data(imageUrl);

  const categoryLogic: Record<string, string> = {
    '二次元/日系': '重点关注面部十字线比例、五官协调性、头发分组与走向、线条的流畅度，以及整体颜色的清透感。',
    '厚涂/写实': '重点关注三大面五大调的完整性、体积感塑造、光影逻辑、边缘线（软硬边）处理、色彩冷暖对比及透气感。',
    '半厚涂': '重点关注线稿与色块的融合、体积感与平面感的平衡、受光面的厚实度与暗部的通透感，以及刻画重点（如五官）的精细度。',
    '赛璐璐': '重点关注闭合线稿的流畅度和张力、阴影形状的设计感（日夜转换/硬阴影为主）、高光的概括性、色彩明度/饱和度的搭配。',
    '概念原画': '重点关注故事性传达、构图的视觉引导线、大基调色彩与情感氛围的契合度、设计的独特性以及整体剪影轮廓的辨识度。',
    '速写/线稿': '重点关注线条的轻重缓急、虚实疏密对比、形体动态线的抓取（长线）、结构的准确性以及透视的合理性。',
    '素描': '重点关注黑白灰关系的拉开、明暗交界线的虚实变化、反光的控制、排线的方向与形体体块的紧密结合感。',
    '水彩': '重点关注水分的控制（水渍边缘）、颜色的晕开与过渡、留白技巧的掌握、色彩的透明感、以及干湿画法的结合。',
    '人体结构': '重点关注人体八头身比例、重心线的稳定、三大体块（头、胸腔、骨盆）的透视与扭转关系、主要关节的连接点。',
    '肌肉解剖': '重点关注表层主要肌肉起止点的准确性、肌肉在不同动态下的挤压与拉伸状态、骨点的外露表现。'
  };

  const logicDescription = category ? categoryLogic[category] || '请根据常规绘画标准进行综合评估。' : '请根据常规绘画标准进行综合评估。';

  const prompt = `你是一位严厉且专业的数字艺术导师（AI教员）。
  
作业标题：${assignment.title}
作业要求：${assignment.description}
评分标准：
${assignment.criteria.map(c => `- ${c}`).join('\n')}
学生选择的绘画风格/类别：${category || '未指明'}
【该类别的独立批改逻辑核心要素】：${logicDescription}

${editMode === 'global' ? '【重要】：学生申请了全局红笔改图，请不要改变原图内容本身，而像真人老师一样直接在原图基础上进行大透视、动态、整体颜色/氛围的修正。请给出详细的改图指南，说明该如何调整大结构。' : ''}
${editMode === 'local' ? '【重要】：学生申请了局部精确改图。请像真人老师在原图上画圈修改一样，重点修正五官局部错位、手部结构、某个转折结构等显眼的微观细节问题。并给出精确修改指南。' : ''}

请结合上述专门为该类别定制的批改逻辑进行专业点评。并且必须给出练习作业卡反馈。
如果系统启用了联网搜索，请利用最新的资源对比网络上的优秀范例。

请务必严格按照以下纯JSON格式输出（不要包含任何Markdown代码块如 \`\`\`json 标签）：
{
  "score": <0-100的评分数字>,
  "overall": "<一段精炼的总体评价>",
  "strengths": ["<优点1>", "<优点2>"],
  "weaknesses": ["<问题点1>", "<问题点2>"],
  "explanations": ["<对画面存在问题的深入讲解与原理剖析>", "<讲解2>"],
  "knowledgePoints": ["<相关的美术理论知识点补充或术语解释>", "<知识点2>"],
  "practiceCards": [
    {"title": "<练习作业重点名称>", "task": "<具体的练习任务描述>", "reason": "<为什么要进行此练习，能解决当前什么问题>"}
  ],
  "editSuggestions": "<如果是申请了改图，这里填写老师般的具体修改指示（哪里如何重画/叠色/修型），如果没有则为空字符串>"
}`;

  const config: any = {
    responseMimeType: "application/json",
  };

  if (settings.enableWebSearch) {
    config.tools = [{ googleSearch: {} }];
  }

  try {
    const response = await ai.models.generateContent({
      model: settings.visionModel || 'gemini-3.1-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType, data } },
          { text: prompt }
        ]
      },
      config
    });

    let text = response.text || '';
    
    // Sometimes it still returns markdown blocks
    text = text.trim().replace(/^```json\n?/, '').replace(/\n?```$/, '');

    return JSON.parse(text) as Feedback;
  } catch (error) {
    console.error('Error grading drawing:', error);
    throw new Error('批改失败，请确保API可用或尝试刷新重试。');
  }
}

export async function generateEditedImage(imageUrl: string, editInstruction: string): Promise<string> {
  const settings = getAppSettings();
  const apiKey = settings.apiKey || (import.meta as any).env?.VITE_GEMINI_API_KEY || (process as any).env?.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('未配置 Gemini API Key，请在设置中添加。');
  }

  const ai = new GoogleGenAI(
    settings.baseUrl ? { apiKey, httpOptions: { baseUrl: settings.baseUrl } } : { apiKey }
  );
  const { mimeType, data } = extractBase64Data(imageUrl);

  try {
    const response = await ai.models.generateContent({
      model: settings.editModel || 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: data,
              mimeType: mimeType,
            },
          },
          {
            text: `请根据以下修改建议对此图像进行改图（局部针对性修正或标注，不是重新生成一模一样但风格不同的图）：${editInstruction}`,
          },
        ],
      },
    });

    for (const candidate of response.candidates || []) {
      for (const part of candidate.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error('模型未能生成编辑后的图像');
  } catch (error) {
    console.error('Error editing image:', error);
    throw new Error('改图失败，请检查模型支持情况或重试。');
  }
}
