// 4階層のデータ構造（中見出し付き）
const quadData = {
    core: {
        mission: '',
        vision: '',
        businessStrategy: ''
    },
    why: {
        targetUser: '',
        pain: '',
        gain: '',
        marketAnalysis: '',
        competitorAnalysis: ''
    },
    what: {
        mentalModel: '',
        customerJourney: '',
        costStructure: '',
        revenueModel: '',
        metrics: '',
        milestones: ''
    },
    how: {
        userInterface: '',
        designImplementation: '',
        goToMarket: ''
    }
};

// 中見出しと項目の構造
const layerStructure = {
    core: [
        {
            title: 'プロダクトの世界観',
            items: ['mission', 'vision']
        },
        {
            title: '企業への貢献',
            items: ['businessStrategy']
        }
    ],
    why: [
        {
            title: '誰をどんな状態にしたいか',
            items: ['targetUser', 'pain', 'gain']
        },
        {
            title: 'なぜ自社がするのか',
            items: ['marketAnalysis', 'competitorAnalysis']
        }
    ],
    what: [
        {
            title: 'ユーザー体験',
            items: ['mentalModel', 'customerJourney']
        },
        {
            title: 'ビジネスモデル',
            items: ['costStructure', 'revenueModel']
        },
        {
            title: 'ロードマップ',
            items: ['metrics', 'milestones']
        }
    ],
    how: [
        {
            title: 'どのように実現するのか',
            items: ['userInterface', 'designImplementation', 'goToMarket']
        }
    ]
};

// 簡易版の表示項目（項目が少ない状態）
const liteModeStructure = {
    core: [
        {
            title: 'プロダクトの世界観',
            items: ['mission', 'vision']
        }
    ],
    why: [
        {
            title: '誰をどんな状態にしたいか',
            items: ['targetUser', 'pain', 'gain']
        }
    ],
    what: [
        {
            title: 'ユーザー体験',
            items: ['mentalModel', 'customerJourney']
        }
    ],
    how: [
        {
            title: 'どのように実現するのか',
            items: ['userInterface', 'designImplementation', 'goToMarket']
        }
    ]
};

// 項目名の日本語マッピング
const itemLabels = {
    mission: 'ミッション',
    vision: 'ビジョン',
    businessStrategy: '事業戦略',
    targetUser: 'ターゲットユーザー',
    pain: 'ペイン',
    gain: 'ゲイン',
    marketAnalysis: '市場分析',
    competitorAnalysis: '競合分析',
    mentalModel: 'メンタルモデル',
    customerJourney: 'カスタマージャーニー',
    costStructure: 'コスト構造',
    revenueModel: '収益モデル',
    metrics: '指標',
    milestones: 'マイルストーン',
    userInterface: 'ユーザーインターフェース',
    designImplementation: '設計と実装',
    goToMarket: 'Go To Market'
};

// レイヤー生成
function generateLayers() {
    const isFullMode = document.getElementById('version-switch').checked;
    const currentStructure = isFullMode ? layerStructure : liteModeStructure;
    
    // 各レイヤーを生成
    ['core', 'why', 'what', 'how'].forEach(layer => {
        const contentDiv = document.getElementById(`${layer}-content`);
        contentDiv.innerHTML = '';
        
        currentStructure[layer].forEach(subsection => {
            // 中見出し
            const subheading = document.createElement('h3');
            subheading.className = 'subheading';
            subheading.textContent = subsection.title;
            contentDiv.appendChild(subheading);
            
            // 項目を横並びにするコンテナ
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'items-container';
            
            subsection.items.forEach(itemKey => {
                const itemGroup = document.createElement('div');
                itemGroup.className = 'item-group';
                
                const label = document.createElement('label');
                label.className = 'item-label';
                label.textContent = itemLabels[itemKey];
                
                const textarea = document.createElement('textarea');
                textarea.className = 'item-textarea';
                textarea.placeholder = `${itemLabels[itemKey]}を入力してください...`;
                textarea.value = quadData[layer][itemKey] || '';
                textarea.addEventListener('input', (e) => {
                    quadData[layer][itemKey] = e.target.value;
                });
                
                itemGroup.appendChild(label);
                itemGroup.appendChild(textarea);
                itemsContainer.appendChild(itemGroup);
            });
            
            contentDiv.appendChild(itemsContainer);
        });
    });
}

// 保存機能
function saveToMarkdown() {
    const isFullMode = document.getElementById('version-switch').checked;
    const currentStructure = isFullMode ? layerStructure : liteModeStructure;
    const version = isFullMode ? 'Full' : 'Lite';
    
    // 日付生成
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename = document.getElementById('filename-input').value.trim();
    const finalFilename = filename ? `${dateStr} ${filename}` : `${dateStr} PQL`;
    
    // Markdown生成
    let markdown = `# Product Quad Layer Builder - ${version} Version\n\n`;
    markdown += `生成日時: ${today.toLocaleString('ja-JP')}\n\n`;
    
    // 各レイヤーをMarkdown形式で生成
    ['core', 'why', 'what', 'how'].forEach(layer => {
        const layerNames = { core: 'Core', why: 'Why', what: 'What', how: 'How' };
        markdown += `# ${layerNames[layer]}\n\n`;
        
        currentStructure[layer].forEach(subsection => {
            markdown += `## ${subsection.title}\n\n`;
            
            subsection.items.forEach(itemKey => {
                const value = quadData[layer][itemKey] || '';
                markdown += `### ${itemLabels[itemKey]}\n\n`;
                markdown += `${value}\n\n`;
            });
        });
    });
    
    // ファイルダウンロード
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${finalFilename}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // トースト通知表示
    showToast(`${version} バージョンで保存しました`, 'success');
}

// トースト通知表示関数
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 5000);
}

// イベントリスナー設定
document.addEventListener('DOMContentLoaded', function() {
    // バージョン切り替え
    document.getElementById('version-switch').addEventListener('change', function() {
        generateLayers();
    });
    
    // ファイル読み込み機能
    function loadFromFile() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.md';
        input.onchange = function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const content = e.target.result;
                        parseMarkdownContent(content);
                        showToast('ファイルを読み込みました', 'success');
                    } catch (error) {
                        showToast('ファイルの読み込みに失敗しました', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // Markdown内容を解析してデータに反映
    function parseMarkdownContent(content) {
        const lines = content.split('\n');
        let currentLayer = null;
        let currentSubsection = null;
        let currentItem = null;
        
        for (let line of lines) {
            line = line.trim();
            
            // レイヤー検出
            if (line.startsWith('# Core')) {
                currentLayer = 'core';
            } else if (line.startsWith('# Why')) {
                currentLayer = 'why';
            } else if (line.startsWith('# What')) {
                currentLayer = 'what';
            } else if (line.startsWith('# How')) {
                currentLayer = 'how';
            }
            // 項目検出
            else if (line.startsWith('### ')) {
                const itemName = line.replace('### ', '');
                // 日本語ラベルからキーを逆引き
                for (let [key, label] of Object.entries(itemLabels)) {
                    if (label === itemName && currentLayer) {
                        currentItem = key;
                        break;
                    }
                }
            }
            // 内容検出
            else if (currentItem && currentLayer && line && !line.startsWith('#')) {
                if (quadData[currentLayer] && quadData[currentLayer][currentItem] !== undefined) {
                    quadData[currentLayer][currentItem] = line;
                }
            }
        }
        
        // レイヤーを再生成
        generateLayers();
    }

    // イベントリスナー設定
    document.getElementById('load-btn').addEventListener('click', loadFromFile);
    document.getElementById('save-btn').addEventListener('click', saveToMarkdown);
    
    // 初期レイヤー生成
    generateLayers();
});
