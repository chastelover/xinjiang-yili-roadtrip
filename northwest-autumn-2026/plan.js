/* Daily overview and National Day road notes. AMap v5 driving snapshots queried 2026-09-29. */
(()=>{'use strict';
const $=(s,r=document)=>r.querySelector(s);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const amap='https://ditu.amap.com/dir';
// All points are examples or candidates, not confirmed bookings or exact home addresses.
// These figures are a 2026-09-29 snapshot of AMap v5 driving strategy=32, first returned route.
// No API credential is used by, or published with, this static page.
const points={
 hanzhong:['汉中市人民政府（市区示例）','107.023158,33.066255'],
 wuwei:['凉州宾馆（候选）','102.639306,37.927595'],
 danxia:['张掖七彩丹霞景区北门停车场','100.067535,38.974453'],
 jiayuguan:['酒钢宾馆（候选）','98.267621,39.798667'],
 jgn:['嘉峪关酒泉机场停车场','98.341750,39.865143'],
 ejina:['额济纳大漠酒店（候选）','101.071907,41.957403'],
 poplar:['额济纳胡杨林旅游区西大门游客中心','101.082437,41.962176'],
 juyanhai:['居延海景区西门地上停车场','101.233675,42.339175'],
 inc:['银川河东国际机场','106.393399,38.321759'],
 yinchuan:['银川中心智选假日酒店（候选）','106.208984,38.499845'],
 shapotou:['沙坡头旅游景区P3黄河区停车场','105.019413,37.465153'],
 zhongwei:['中卫沙坡头希尔顿欢朋酒店（候选）','105.201299,37.515030']
};
const legs={
 d1:['hanzhong','wuwei',851646,37180],
 d2a:['wuwei','danxia',281403,12133],d2b:['danxia','jiayuguan',210998,8969],
 d2c:['jiayuguan','jgn',15202,1398],d2d:['jgn','jiayuguan',15922,1482],
 d3:['jiayuguan','ejina',391102,19448],
 d4a:['ejina','poplar',1379,248],d4b:['poplar','ejina',1409,275],
 d4lake:['juyanhai','poplar',51731,3130],
 d5a:['ejina','juyanhai',52095,3191],d5b:['juyanhai','inc',862735,37683],
 d5direct:['ejina','inc',811489,33702],d5c:['inc','yinchuan',40405,2911],
 d6a:['yinchuan','shapotou',203563,8718],d6b:['shapotou','zhongwei',18965,1543],
 d7:['zhongwei','hanzhong',648693,27261]
};
const dayLegs={1:['d1'],2:['d2a','d2b','d2c','d2d'],3:['d3'],4:['d5a','d4lake','d4b'],5:['d5direct','d5c'],6:['d6a','d6b'],7:['d7']};
const day4DirectLegs=['d4a','d4b'];
const juyanhaiLegs=['d5a','d5b','d5c'];
const km=meters=>(meters/1000).toFixed(1)+'公里';
const duration=seconds=>{const minutes=Math.round(seconds/60),hours=Math.floor(minutes/60),rest=minutes%60;return hours?hours+'小时'+(rest?rest+'分':''):minutes+'分'};
const totals=ids=>ids.reduce((value,id)=>[value[0]+legs[id][2],value[1]+legs[id][3]],[0,0]);
const routeLink=id=>{const leg=legs[id],from=points[leg[0]],to=points[leg[1]];return 'https://uri.amap.com/navigation?from='+encodeURIComponent(from[1]+','+from[0])+'&to='+encodeURIComponent(to[1]+','+to[0])+'&mode=car&coordinate=gaode&callnative=0&src=northwest-autumn-2026'};
const legText=id=>{const leg=legs[id];return points[leg[0]][0]+' → '+points[leg[1]][0]+'：'+km(leg[2])+'，'+duration(leg[3])};
const legHtml=id=>'<li>'+esc(legText(id))+' <a href="'+esc(routeLink(id))+'" target="_blank" rel="noopener noreferrer">高德导航 ↗</a></li>';
const sources={
 gansu:['甘肃经济日报｜2026国庆路网出行预测','https://gansu.gansudaily.com.cn/system/2026/09/28/031438828.shtml'],
 police:['甘肃公安交管总队｜2025国庆交通提示','https://gansu.gscn.com.cn/system/2025/09/30/013392417.shtml'],
 jiayuguan:['嘉峪关市政府｜2026节前景区及收费站疏导','https://wap.jyg.gov.cn/xwzx/bdyw/art/2026/art_0d599b41dc6b4a77a4d4948c03efad4e.html'],
 yinchuan:['银川交警｜2025国庆返程提示','https://police.yinchuan.gov.cn/xwdt/cjjx/jtjcfj/202510/t20251013_5051115.html'],
 sunrise4:['美国海军天文台｜2026-10-04居延海附近日出','https://aa.usno.navy.mil/api/rstt/oneday?date=2026-10-04&coords=42.33354,101.243935&tz=8'],
 sunrise5:['美国海军天文台｜2026-10-05居延海附近日出','https://aa.usno.navy.mil/api/rstt/oneday?date=2026-10-05&coords=42.33354,101.243935&tz=8'],
 lakeHours:['携程景区页｜居延海当前开放时间','https://you.ctrip.com/sight/ejinbanner2973/144737.html']
};
const days=[
 {n:1,route:'汉中 → 武威',visit:'0小时；仅途中休息',food:'武威晚餐',stay:'武威3家备选（高德按凉州宾馆）',risk:'中',delay:'0—30分钟情景',road:'甘肃省预测10月1日上午有出城高峰；这不能直接换算成汉中至武威全程堵车分钟。',action:'尽量避开已知高峰，按实际路线和疲劳程度调整当天终点。',refs:['gansu']},
 {n:2,route:'武威 → 张掖七彩丹霞 → 嘉峪关',visit:'七彩丹霞3—4小时',food:'张掖午餐／嘉峪关晚餐',stay:'嘉峪关3家备选（高德按酒钢宾馆）',risk:'中',delay:'0—30分钟情景；景区排队另计',road:'甘肃省预测10月2日上午仍有出城车流；嘉峪关已部署景区停车和收费站疏导。没有丹霞入口该日的可量化排队样本。',action:'丹霞离园时间由MU6675计划21:15抵达的接机安排倒排；景区排队明显时缩短游览区域。',refs:['gansu','jiayuguan']},
 {n:3,route:'嘉峪关 → 额济纳；航天参观仅预约后绕行',visit:'航天参观待确认；否则不加景点',food:'抵达额济纳后用餐',stay:'额济纳4家备选，须连住两晚',risk:'中',delay:'固定拥堵数据不足；不填虚假分钟',road:'甘肃公安2025年国庆提示将G213酒泉至额济纳段列为事故易发路段；该信息不等于一定堵车。',action:'核对实际参观结束地点；保持白天驾驶，进镇前加油并留有弹性。',refs:['police']},
 {n:4,route:'额济纳 → 居延海 → 胡杨林 → 额济纳（优先方案）',visit:'居延海日出＋胡杨林约7小时',food:'自备早饭／景区简餐／回镇晚餐',stay:'额济纳同一酒店续住（4选1）',risk:'高',delay:'0—60分钟情景；停车及摆渡另计',road:'按9月29日高德快照，酒店经居延海到胡杨林再回酒店约105.2公里、纯驾驶约1小时50分；清晨入园与国庆排队未计入。',action:'10月3日晚确认居延海检票和摆渡、备早餐并早睡；若不适合早起，改胡杨林先行、下午再看居延海，或将湖留作5日条件备选。',refs:['sunrise4','lakeHours']},
 {n:5,route:'额济纳 → 银川河东机场 → 银川；居延海为条件备选',visit:'优先保障送机；4日未去时核算居延海清晨备选',food:'途中正常休息用餐／送机后银川晚餐',stay:'银川3家备选（高德按中心智选假日）',risk:'路况中／赶机高',delay:'公路堵车无法量化；另留道路缓冲',road:'居延海西门停车场到机场约862.7公里、纯驾驶10小时28分。若07:35驶离停车场，再加1.5小时休息和1小时道路缓冲，预计20:33抵达机场，晚于本方案19:10到达目标。',action:'10月4日晚和5日清晨按实际酒店、检票摆渡、实时导航及航班倒排。仅当保留正常休息后仍能满足机场时间，或已调整返京交通时，才启用居延海支线；否则直赴机场。',refs:['sunrise5','lakeHours']},
 {n:6,route:'银川 → 沙坡头 → 中卫',visit:'沙坡头5—6小时',food:'银川早餐／中卫晚餐',stay:'中卫3家备选（高德按希尔顿欢朋）',risk:'中',delay:'0—30分钟情景；景区排队另计',road:'2025年银川交警提示返程可关注银川出入口，银川往返中卫可视路况比较G1816乌玛高速。',action:'当日看高德实时路线再决定高速；游览后住中卫，不折返银川。',refs:['yinchuan']},
 {n:7,route:'中卫 → 汉中',visit:'0小时；全天返程',food:'途中顺路用餐',stay:'返抵汉中；必要时增加途中住宿',risk:'中—高',delay:'0—60分钟情景；不能视为保证',road:'甘肃省预测10月7日8:00—20:00返程车流集中；该预测不等于所有路段同时拥堵。',action:'早出发并保留停车休息；遇疲劳或明显延误可增加途中住宿。',refs:['gansu']}
];
const style=document.createElement('style');style.textContent=`
.day-overview{background:#eef2e5;border:1px solid #d3dfc8;border-left:4px solid #b89c4c;padding:21px 24px;margin:0 0 25px;border-radius:4px}.day-overview h4,.road-day h4{font-size:18px;color:#214934;margin:0 0 14px}.day-overview-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px 25px}.overview-cell{min-width:0}.overview-cell span{display:block;font-size:11px;letter-spacing:.06em;color:#607259}.overview-cell strong{font-size:14px;line-height:1.65;color:#263c2e;font-weight:600}.overview-cell a{font-size:12px;display:inline-block;margin-left:8px;text-decoration:underline;text-underline-offset:2px}.road-day{margin-top:24px;padding:20px 24px;background:#f6f5ec;border:1px solid #dedcc6;border-radius:4px}.road-day dl{display:grid;grid-template-columns:max-content 1fr;column-gap:18px;row-gap:9px;font-size:13px;line-height:1.8}.road-day dt{color:#637063;font-weight:600}.road-day dd{margin:0;color:#334837}.road-day .risk-high{color:#9c4730}.road-day .risk-medium{color:#8b6b20}.road-day .road-proof{font-size:12px;color:#69736a;margin-top:12px}.road-day .road-proof a{text-decoration:underline;text-underline-offset:2px}.plan-method-note{background:#f2ead8;border-left:4px solid #ad8038;padding:16px 20px;font-size:13px;line-height:1.8;margin:20px 0}.plan-method-note a{text-decoration:underline}.day-card{scroll-margin-top:90px}@media(max-width:650px){.day-overview-grid{grid-template-columns:1fr}.day-overview,.road-day{padding:18px}.road-day dl{grid-template-columns:1fr;row-gap:2px}.road-day dd{margin-bottom:8px}}
`;style.textContent+='.route-leg-list{margin:14px 0 0;padding-left:20px;font-size:13px;line-height:1.8;color:#465d46}.route-leg-list li{padding:3px 0;overflow-wrap:anywhere}.route-alternate{margin-top:15px;padding:13px 15px;background:#fff5e7;border-left:3px solid #ad8038;font-size:13px;line-height:1.8}.route-alternate p{margin-top:6px}.route-alternate strong{color:#785425}@media(max-width:650px){.route-leg-list{padding-left:18px}}';document.head.appendChild(style);
function sourceLinks(d){return d.refs.map(k=>`<a href="${esc(sources[k][1])}" target="_blank" rel="noopener noreferrer">${esc(sources[k][0])} ↗</a>`).join(' · ')}
for(const d of days){const body=$(`#day-${d.n} .day-body`);if(!body)continue;
 const [meters,seconds]=totals(dayLegs[d.n]);
 const alternate=d.n===4?(()=>{const [altMeters,altSeconds]=totals(day4DirectLegs);return '<div class="route-alternate"><strong>当天不赶居延海日出：胡杨林直达 '+km(altMeters)+' / '+duration(altSeconds)+'</strong><p>若前一晚到店较晚或早晨景区未按公开时间开放，可先游胡杨林；仍想当天看湖，可按开放与体力改为下午短游。若4日未去成，5日还有条件备选。</p><ol class="route-leg-list">'+day4DirectLegs.map(legHtml).join('')+'</ol></div>'})():d.n===5?(()=>{const [altMeters,altSeconds]=totals(juyanhaiLegs),airport=legs.d5b;return '<div class="route-alternate"><strong>4日未去居延海时的5日备选：'+km(altMeters)+' / '+duration(altSeconds)+'（含送机后进银川）</strong><p>其中居延海西门停车场 → 银川河东机场：'+km(airport[2])+' / '+duration(airport[3])+'。若07:35从停车场驶离，按纯驾驶＋1.5小时休息＋1小时道路缓冲，预计20:33到机场，晚于19:10目标。仅在实时导航及正常休息仍满足机场时间，或返京交通已调整时启用；清晨短游与看完整日出分别倒排。</p><ol class="route-leg-list">'+juyanhaiLegs.map(legHtml).join('')+'</ol></div>'})():'';
 const overview=document.createElement('section');overview.className='day-overview';overview.setAttribute('aria-label','今日总览');overview.innerHTML=`<h4>今日总览</h4><div class="day-overview-grid"><div class="overview-cell"><span>🚗 行驶路线</span><strong>${esc(d.route)}</strong></div><div class="overview-cell"><span>📏 高德预计公里</span><strong>${km(meters)}</strong></div><div class="overview-cell"><span>⏱ 高德预计纯驾驶</span><strong>${duration(seconds)}</strong></div><div class="overview-cell"><span>🎫 游玩时间</span><strong>${esc(d.visit)}</strong></div><div class="overview-cell"><span>🍽 当日美食</span><strong>${esc(d.food)}</strong></div><div class="overview-cell"><span>🏨 当晚住宿</span><strong>${esc(d.stay)}</strong></div><div class="overview-cell"><span>🛣 国庆路况</span><strong>${esc(d.risk)}</strong></div></div><ol class="route-leg-list">${dayLegs[d.n].map(legHtml).join('')}</ol>${alternate}`;body.prepend(overview);
 const road=document.createElement('section');road.className='road-day';road.setAttribute('aria-label','国庆路况分析');road.innerHTML=`<h4>🛣 国庆路况分析</h4><dl><dt>相对风险</dt><dd class="${d.risk.includes('高')?'risk-high':'risk-medium'}">${esc(d.risk)}（经验判断，非统计概率）</dd><dt>堵车额外时间</dt><dd>${esc(d.delay)}</dd><dt>风险依据</dt><dd>${esc(d.road)}</dd><dt>建议</dt><dd>${esc(d.action)}</dd></dl><p class="road-proof">${sourceLinks(d)||'本日景区没有可核实的同日同路段历史量化资料。'}</p>`;body.appendChild(road);
}
const heading=$('#itinerary .section-heading');if(heading){const note=document.createElement('p');note.className='plan-method-note';note.innerHTML='每日公里与纯驾驶时间来自高德 v5 驾车路线 2026-09-29 查询快照，<strong>不含休息、游览或未来国庆拥堵</strong>；具体地点和路线见逐日分段。“堵车额外时间”为排程预留情景，不是统计概率或实时预测。出发当天仍需查看 <a href="https://ditu.amap.com/dir" target="_blank" rel="noopener noreferrer">高德路线规划</a>及当地交警通告。';heading.after(note)}
window.tripDayOverviewMarkdown=n=>{
 const d=days[n-1];if(!d)return '';
 const [meters,seconds]=totals(dayLegs[n]);
 let content='### 今日总览\n\n- 路线：'+d.route+'\n- 高德预计公里：'+km(meters)+'\n- 高德预计纯驾驶：'+duration(seconds)+'\n- 游玩：'+d.visit+'\n- 美食：'+d.food+'\n- 住宿：'+d.stay+'\n- 路况：'+d.risk+'\n- 逐段高德导航（2026-09-29 查询）：\n';
 content+=dayLegs[n].map(id=>'  - '+legText(id)+' [高德导航]('+routeLink(id)+')').join('\n')+'\n';
 if(n===4){const [altMeters,altSeconds]=totals(day4DirectLegs);content+='- 早晨条件不合适时，直接去胡杨林：'+km(altMeters)+'、纯驾驶'+duration(altSeconds)+'；也可按开放时间改为下午短游居延海。\n';content+=day4DirectLegs.map(id=>'  - 不赶日出：'+legText(id)+' [高德导航]('+routeLink(id)+')').join('\n')+'\n'}
 if(n===5){const [altMeters,altSeconds]=totals(juyanhaiLegs);content+='- 若4日未去，居延海是5日有条件备选：'+km(altMeters)+'、纯驾驶'+duration(altSeconds)+'（含送机后进银川）。居延海西门停车场→银川河东机场：'+km(legs.d5b[2])+'、纯驾驶'+duration(legs.d5b[3])+'。07:35驾车离开停车场，若再加1.5小时休息和1小时道路缓冲，预计20:33到机场，晚于本方案19:10到达目标。须用当天路线、正常休息及实际航班重新倒排，或先落实改签、独立交通。\n';content+=juyanhaiLegs.map(id=>'  - 条件备选：'+legText(id)+' [高德导航]('+routeLink(id)+')').join('\n')+'\n'}
 return content+'- 查询边界：高德 v5 驾车 strategy=32，首条返回方案，逐段相加；汉中市人民政府是市区示例起终点，酒店及景区入口为候选。纯驾驶不含休息、游览或未来国庆拥堵，行前须按实际位置及实时路况重查。\n\n';
};
window.tripRoadDayMarkdown=n=>{const d=days[n-1];return d?`### 国庆路况分析\n\n- 相对风险：${d.risk}（经验判断，非统计概率）\n- 堵车额外时间：${d.delay}\n- 风险依据：${d.road}\n- 建议：${d.action}\n${d.refs.map(k=>`- 依据：[${sources[k][0]}](${sources[k][1]})`).join('\n')}\n\n`:''};
window.tripRoadMarkdown=()=>`\n## 路况与高德核验边界\n\n堵车时长为保守排程情景，不是基于同路段同日期样本的统计预测；没有量化证据时不填写假概率。以上公里与纯驾驶时间是2026-09-29高德 v5 驾车 strategy=32 的首条返回方案，按具体候选酒店、景区停车场和机场逐段相加；汉中市人民政府只是市区示例起终点。纯驾驶不含休息、游览与未来国庆拥堵，实际预订地址、景区开放入口和实时路况变化后须重新查询。${amap}\n`;
})();
