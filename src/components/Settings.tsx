import React, { useState, useEffect } from 'react';
import { AppSettings } from '../types';
import { getAppSettings, saveAppSettings } from '../lib/gemini';
import { Settings as SettingsIcon, Save, Key, Sparkles, Globe, Edit3, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';

export function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    apiKey: '',
    baseUrl: '',
    visionModel: 'gemini-3.1-pro-preview',
    editModel: 'gemini-2.5-flash-image',
    enableWebSearch: true,
  });

  const [saved, setSaved] = useState(false);
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  const [loadingModels, setLoadingModels] = useState(false);

  useEffect(() => {
    setSettings(getAppSettings());
  }, []);

  const handleSave = () => {
    saveAppSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const testConnectionAndFetchModels = async () => {
    setLoadingModels(true);
    try {
      let url = `https://generativelanguage.googleapis.com/v1beta/models?key=${settings.apiKey}`;
      
      // If there is a baseUrl, it could be a raw proxy (append /v1beta/models) or an OpenAI compatible proxy (append /v1/models)
      if (settings.baseUrl) {
        // Try standard google format first, if failed try openai format
        const cleanBase = settings.baseUrl.replace(/\/$/, '').replace(/\/v1$/, '').replace(/\/v1beta$/, '');
        url = `${cleanBase}/v1/models`; // typically proxies put it at /v1/models
      }
      
      const headers: Record<string, string> = {};
      if (settings.baseUrl && settings.apiKey) {
        headers['Authorization'] = `Bearer ${settings.apiKey}`;
      }

      let res = await fetch(url, { headers });
      
      // Fallback for direct Google format through proxy
      if (!res.ok && settings.baseUrl) {
         const cleanBase = settings.baseUrl.replace(/\/$/, '');
         res = await fetch(`${cleanBase}/v1beta/models?key=${settings.apiKey}`);
      }

      if (!res.ok) throw new Error("获取模型失败");
      
      const data = await res.json();
      let modelNames: string[] = [];
      
      if (data.data && Array.isArray(data.data)) {
        // OpenAI format
        modelNames = data.data.map((m: any) => m.id);
      } else if (data.models && Array.isArray(data.models)) {
        // Google format
        modelNames = data.models.map((m: any) => m.name.replace('models/', ''));
      }
      
      if (modelNames.length > 0) {
        setAvailableModels(modelNames);
        alert(`成功获取 ${modelNames.length} 个可用模型！`);
      } else {
        alert("连接成功但未发现可用模型。");
      }
    } catch (e) {
      console.error(e);
      alert("无法获取模型列表，请确认 API Key 及代理地址是否正确。错误信息: " + (e as Error).message);
    } finally {
      setLoadingModels(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto pb-20 mt-4"
    >
      <div className="mb-14">
        <h1 className="text-5xl font-black tracking-tighter">SETTINGS<span className="text-correction underline">.</span></h1>
        <p className="text-base font-bold text-white/60 tracking-widest mt-4">偏好设置与大模型 API 配置（兼容官方与中转）</p>
      </div>

      <div className="space-y-10">
        
        {/* API Configuration */}
        <div className="bg-[#111] border border-glass p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-correction opacity-5 blur-[100px] pointer-events-none" />
          <div className="flex items-center gap-4 mb-8 border-b border-glass pb-6">
            <div className="w-10 h-10 bg-correction/10 border border-correction flex items-center justify-center">
              <Key className="w-5 h-5 text-correction" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">API 通讯配置</h2>
          </div>
          <div className="space-y-8">
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3">API Base URL (代理地址)</label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input 
                  type="text"
                  value={settings.baseUrl}
                  onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
                  placeholder="例如: https://api.proxy.com (默认留空使用官方)"
                  className="w-full bg-[#0A0A0A] border border-glass text-white pl-12 pr-4 py-4 text-base focus:outline-none focus:border-correction focus:ring-1 focus:ring-correction transition-all font-mono"
                />
              </div>
              <p className="text-xs text-white/40 mt-3 font-medium">支持第三方 API 中转站（例如 OneAPI 或 NewAPI）。通常只需填写域名部分，如 <code>https://api.proxy.com</code>（SDK 会自动追加 /v1beta 等路径）。如果不填则默认直连 Google 官方。</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3">Gemini API Key</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input 
                  type="password"
                  value={settings.apiKey}
                  onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
                  placeholder="在此输入您的 API Key"
                  className="w-full bg-[#0A0A0A] border border-glass text-white pl-12 pr-4 py-4 text-base focus:outline-none focus:border-correction focus:ring-1 focus:ring-correction transition-all font-mono"
                />
              </div>
              <p className="text-xs text-white/40 mt-3 font-medium">若留空，将自动尝试使用环境变量配置的官方密钥。</p>
            </div>
            <button 
              onClick={testConnectionAndFetchModels}
              disabled={loadingModels || !settings.apiKey}
              className="px-6 py-3 bg-glass border border-glass hover:bg-white/5 transition-colors font-bold text-sm tracking-widest flex items-center justify-center gap-2 disabled:opacity-50 w-full md:w-auto"
            >
              <RefreshCw className={loadingModels ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
              测试连接并获取可用模型
            </button>
          </div>
        </div>

        {/* Model Selection */}
        <div className="bg-[#111] border border-glass p-8 md:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 opacity-5 blur-[100px] pointer-events-none" />
          <div className="flex items-center gap-4 mb-8 border-b border-glass pb-6">
            <div className="w-10 h-10 bg-white/5 border border-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tighter">AI 模型调度配置</h2>
          </div>
          
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3">主批改视觉模型 (Vision Model)</label>
                <div className="relative">
                    <input 
                      type="text" 
                      list="vision-models"
                      value={settings.visionModel}
                      onChange={(e) => setSettings({ ...settings, visionModel: e.target.value })}
                      placeholder="如: gemini-3.1-pro-preview"
                      className="w-full bg-[#0A0A0A] border border-glass text-white px-4 py-4 text-base focus:outline-none focus:border-correction transition-colors font-mono"
                    />
                    <datalist id="vision-models">
                      {availableModels.length > 0 ? (
                        availableModels.map(m => <option key={m} value={m} />)
                      ) : (
                        <>
                          <option value="gemini-3.1-pro-preview" />
                          <option value="gemini-3-flash-preview" />
                          <option value="gemini-2.5-flash" />
                        </>
                      )}
                    </datalist>
                </div>
                <p className="text-xs text-white/40 mt-3 font-medium cursor-help" title="用于对画面进行多维度剖析的视觉大模型。建议使用带 Pro 的版本以获得最深度的图文理解。">负责美术打分与问题诊断的最强视觉大脑。</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3">图像修改生成模型 (Image Edit Model)</label>
                <div className="relative">
                    <input 
                      type="text" 
                      list="edit-models"
                      value={settings.editModel}
                      onChange={(e) => setSettings({ ...settings, editModel: e.target.value })}
                      placeholder="如: gemini-2.5-flash-image"
                      className="w-full bg-[#0A0A0A] border border-glass text-white px-4 py-4 text-base focus:outline-none focus:border-correction transition-colors font-mono"
                    />
                    <datalist id="edit-models">
                      {availableModels.length > 0 ? (
                        availableModels.map(m => m.includes('image') && <option key={m} value={m} />)
                      ) : (
                        <>
                          <option value="gemini-2.5-flash-image" />
                          <option value="gemini-3.1-flash-image-preview" />
                        </>
                      )}
                    </datalist>
                </div>
                <p className="text-xs text-white/40 mt-3 font-medium">负责处理全局/局部改图请求，必须为支持图像生成与编辑的文生图模型。</p>
              </div>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-glass bg-white/5 cursor-pointer hover:bg-white/10 transition-colors gap-4"
                 onClick={() => setSettings({ ...settings, enableWebSearch: !settings.enableWebSearch })}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Globe className={settings.enableWebSearch ? "w-5 h-5 text-correction" : "w-5 h-5 text-white/40"} />
                  <span className="text-sm font-bold uppercase tracking-widest text-white">开启联网检索扩展 (Web Grounding)</span>
                </div>
                <p className="text-xs text-white/50 font-medium">允许 AI 导师在遇到特殊知识盲区时，搜索全网最新绘画参考范例和网络技法。</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer pointer-events-none self-start md:self-auto">
                <input 
                  type="checkbox" 
                  className="sr-only peer" 
                  checked={settings.enableWebSearch}
                  readOnly
                />
                <div className="w-14 h-8 bg-glass peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-correction"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Save Actions */}
        <div className="flex justify-end pt-4 pb-12">
          <button 
            onClick={handleSave}
            className="bg-correction text-black font-black uppercase tracking-widest px-10 py-5 hover:bg-white transition-all flex items-center gap-3 shadow-[0_0_30px_rgba(255,77,0,0.3)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]"
          >
            <Save className="w-5 h-5" />
            {saved ? '已保存设置 (SAVED)' : '保存配置选项 (SAVE)'}
          </button>
        </div>

      </div>
    </motion.div>
  );
}
