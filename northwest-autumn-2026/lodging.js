/* Northwest autumn 2026: hotel candidates, not reservations or live inventory. */
(()=>{'use strict';
if(window.tripStayReady)return;
const $=(selector,root=document)=>root.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

// Parking statements below describe the linked hotel's published listing; a space is not guaranteed.
const hotels=[
  {id:'wuwei',days:[1],dates:'10月1日 · 1晚',city:'武威',name:'武威凉州宾馆',type:'市区宾馆',address:'凉州区东大街159号',reason:'位于武威主城区，适合长途抵达后直接入住；携程页面列明24小时前台。次日从市区继续向张掖出发。',parking:'携程页面列有免费停车场；到店车位与实际出入口仍需确认。',check:'晚到房间保留、所订房型的卫浴与近期卫生反馈。',sourceLabel:'携程｜武威凉州宾馆房源与设施',source:'https://hotels.ctrip.com/hotels/68014774.html'},
  {id:'jiayuguan',days:[2],dates:'10月2日 · 1晚',city:'嘉峪关',name:'酒钢宾馆',type:'市区宾馆',address:'雄关西路2号',reason:'位于嘉峪关市区，接机后可直接入住；携程页面列出富强市场、东方百盛等周边位置，次日从市区继续转场。',parking:'携程页面列有免费私人停车场；夜间抵达时应问清入口和车位。',check:'21:15航班落地后的晚到保留、接机到店实际车程。',sourceLabel:'携程｜酒钢宾馆房源与设施',source:'https://hotels.ctrip.com/hotels/439614.html'},
  {id:'ejin',days:[3,4],dates:'10月3—4日 · 连住2晚',city:'额济纳',name:'额济纳旗大漠酒店',type:'达来呼布镇酒店',address:'额济纳旗军民东街7号1栋110号',reason:'两晚住同一处，10月4日游胡杨林不必重新搬行李。携程页面显示酒店在镇区，胡杨林旅游区约11.3公里；以当日导航为准。',parking:'携程页面列有免费私人停车场；国庆车辆集中时先问能否连续两晚停车。',check:'同一酒店连续两晚的房间、热水、保暖和退改条件。',sourceLabel:'携程｜额济纳旗大漠酒店房源与设施',source:'https://hotels.ctrip.com/hotels/112379395.html'},
  {id:'ejinbackup',days:[3,4],dates:'10月3—4日 · 连住2晚备选',city:'额济纳',name:'额济纳旗诺金酒店',type:'达来呼布镇酒店',address:'额济纳旗军民东街；准确门牌以预订页为准',reason:'与大漠酒店同在达来呼布镇，可作为额济纳连住房态不足时的备选。携程近期住客评价有客房清洁和停车的具体反馈，订前仍须核对最新评价。',parking:'携程页面列有免费私人停车；国庆空位和入口须再问。页面充电设施信息与住客评价有冲突，不承诺可充电。',check:'连续两晚同房、热水、保暖、近期卫生图片和退改条件。',sourceLabel:'携程｜额济纳旗诺金酒店房源与评价',source:'https://hotels.ctrip.com/hotels/80892994.html'},
  {id:'yinchuan',days:[5],dates:'10月5日 · 1晚',city:'银川',name:'银川中心智选假日酒店',type:'国际连锁品牌酒店',address:'金凤区亲水大街清水湾幸福枫景花园17号楼',reason:'自驾线完成河东机场送机后再进银川市区入住；次日从酒店前往中卫。IHG官网给出明确地址，便于倒排机场与酒店间的行车时间。',parking:'IHG官网列有地面、地下停车场，约180个车位；车位及当日收费规则应向酒店确认。',check:'送机后晚到保留、次日早餐供应时间和中卫方向出城路线。',sourceLabel:'IHG官网｜银川中心智选假日交通与停车',source:'https://www.ihg.com/holidayinnexpress/hotels/cn/zh/yinchuan/incyd/hoteldetail/directions'},
  {id:'zhongwei',days:[6],dates:'10月6日 · 1晚',city:'中卫',name:'中卫沙坡头希尔顿欢朋酒店',type:'国际连锁品牌酒店',address:'中卫市区，鼓楼东街一带；精确入口以官网地图为准',reason:'沙坡头游览后返回中卫市区休息，次日从中卫直接返汉中。希尔顿官网将酒店列在市区商圈，景区约17公里，不把它当成景区内住宿。',parking:'希尔顿官网列有免费现场自助停车；晚间空位和进出方式需现场确认。',check:'晚到保留、具体导航入口与次日清晨出发安排。',sourceLabel:'希尔顿官网｜中卫沙坡头希尔顿欢朋酒店设施',source:'https://www.hilton.com/zh-hans/hotels/zhyzghx-hampton-zhongwei-shapotou/hotel-info/',locationSourceLabel:'希尔顿官网｜酒店位置与交通',locationSource:'https://www.hilton.com/en/hotels/zhyzghx-hampton-zhongwei-shapotou/hotel-location/'}
];
const hotelForDay=day=>hotels.find(hotel=>hotel.days.includes(day));
const css=`
.lodging-section{background:#f8f5ea;border-block:1px solid #e2dfcf}.lodging-section .section-heading{margin-bottom:23px}.lodging-lead{max-width:95ch;font-size:14px;line-height:1.9;color:#52624c}.lodging-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px;margin-top:25px}.lodging-card{background:#fffefa;border:1px solid #dfdfd3;border-radius:7px;padding:23px;min-width:0;scroll-margin-top:100px;break-inside:avoid}.lodging-card h3{font-family:'PingFang SC','Microsoft YaHei','Noto Sans CJK SC',sans-serif;font-size:20px;line-height:1.5;color:#214532}.lodging-card .lodging-date{font-size:12px;color:#846a30;letter-spacing:.04em}.lodging-card .lodging-type{font-size:12px;color:#607159;margin-top:5px}.lodging-card dl{display:grid;grid-template-columns:67px minmax(0,1fr);gap:8px 10px;margin:17px 0 18px;font-size:13px;line-height:1.8}.lodging-card dt{font-weight:650;color:#344c35}.lodging-card dd{margin:0;color:#52624e;overflow-wrap:anywhere}.lodging-card a,.lodging-day a,.lodging-to-list{display:inline-flex;align-items:center;min-height:42px;font-size:13px;color:#28553a;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}.lodging-card a:hover,.lodging-day a:hover{color:#886710}.lodging-notice{font-size:12px;line-height:1.9;color:#68725b;margin-top:23px}.lodging-day{margin-top:18px;background:#eaf1e8;border-left:3px solid #60805e;border-radius:2px;padding:17px 21px;scroll-margin-top:100px}.lodging-day h4{font-size:16px;line-height:1.6;color:#2a4936}.lodging-day p{font-size:13px;line-height:1.9;color:#516451;margin-top:8px}.lodging-day .lodging-mini-meta{font-size:12px;color:#637159}.lodging-day a{margin-top:6px}.lodging-day-final{background:#f3f1e7;border-left-color:#aa9655}.lodging-to-list{margin-top:11px}.navlinks a[href="#lodging"]{white-space:nowrap}
@media(max-width:1000px){.navlinks a[href="#lodging"]{display:none}}
@media(max-width:640px){.lodging-grid{grid-template-columns:1fr}.lodging-card{padding:19px}.lodging-card h3{font-size:18px}.lodging-card dl{grid-template-columns:60px minmax(0,1fr);font-size:12px}.lodging-lead{font-size:13px}.lodging-day{padding:15px 14px}.lodging-day h4{font-size:15px}.lodging-day p{font-size:12px}}
@media print{.lodging-section{background:white;page-break-before:always}.lodging-grid{grid-template-columns:1fr 1fr;gap:10px}.lodging-card{padding:12px;border-color:#aaa}.lodging-card dl{font-size:9pt;line-height:1.5;margin:9px 0}.lodging-card a,.lodging-day a,.lodging-to-list{display:none}.lodging-day{background:white;border:1px solid #aaa;break-inside:avoid;padding:11px}.lodging-notice{font-size:9pt}}
`;
const style=document.createElement('style');
style.id='trip-lodging-style';
style.textContent=css;
document.head.appendChild(style);

function hotelCard(hotel){
  const rows=[['类型',hotel.type],['位置',hotel.address],['入选理由',hotel.reason],['停车',hotel.parking],['预订前核对',hotel.check]];
  return `<article class="lodging-card" id="lodging-hotel-${esc(hotel.id)}" aria-labelledby="lodging-title-${esc(hotel.id)}"><p class="lodging-date">${esc(hotel.dates)} · ${esc(hotel.city)}</p><h3 id="lodging-title-${esc(hotel.id)}">${esc(hotel.name)}</h3><p class="lodging-type">${esc(hotel.type)}</p><dl>${rows.map(([term,description])=>`<dt>${esc(term)}</dt><dd>${esc(description)}</dd>`).join('')}</dl><a href="${esc(hotel.source)}" target="_blank" rel="noopener noreferrer">${esc(hotel.sourceLabel)} ↗</a>${hotel.locationSource?`<br><a href="${esc(hotel.locationSource)}" target="_blank" rel="noopener noreferrer">${esc(hotel.locationSourceLabel)} ↗</a>`:''}</article>`;
}
const section=document.createElement('section');
section.id='lodging';
section.className='section lodging-section';
section.setAttribute('aria-labelledby','lodging-title');
section.innerHTML=`<div class="wrap"><div class="section-heading"><div><span class="subhead">六晚，五处落脚城市</span><h2 id="lodging-title">沿途住宿建议</h2><p>每晚至少一家可直接核对的酒店，额济纳两家二选一并连住两晚。10月7日返抵汉中后不另排酒店。</p></div></div><p class="lodging-lead">筛选时看位置、停车与房间清洁度；清洁度是订房前查看近期住客图片和评价的核对项，不是已验证的当前事实。以下均是候选，未代订。房型、房价、国庆余房和退改条件需要在选定日期后以酒店或平台确认结果为准。</p><div class="lodging-grid">${hotels.map(hotelCard).join('')}</div><p class="lodging-notice">停车信息来自各酒店对应的房源页或官网设施页，表示页面所列设施，不保证抵达时有空位。10月2日晚到嘉峪关、10月3—4日额济纳连住及10月5日送机后的入住，请分别确认房间保留和停车入口。</p></div>`;
const insertionPoint=$('#flights')||$('#stays');
if(insertionPoint)insertionPoint.before(section);

for(let day=1;day<=7;day++){
  const food=$('#food-day-'+day);
  const body=$('#day-'+day+' .day-body');
  if(!body)continue;
  const block=document.createElement('section');
  block.id='lodging-day-'+day;
  block.className='lodging-day'+(day===7?' lodging-day-final':'');
  const hotel=hotelForDay(day);
  if(hotel){
    const label=day===4?'继续连住':'今晚建议';
    block.innerHTML=`<h4>${esc(label)}｜${esc(hotel.name)}</h4><p class="lodging-mini-meta">${esc(hotel.city)} · ${esc(hotel.type)} · ${esc(hotel.dates)}</p><p>${esc(hotel.reason)}</p><p>停车：${esc(hotel.parking)}</p><a href="#lodging-hotel-${esc(hotel.id)}">查看位置、核对事项与酒店来源</a>${day===3||day===4?'<p>备选：额济纳旗诺金酒店，同样需连续订两晚。</p><a href="#lodging-hotel-ejinbackup">查看备选酒店与来源</a>':''}`;
  }else{
    block.innerHTML='<h4>今晚不另排酒店｜返回汉中</h4><p>10月7日以安全返程为目标。若道路或体力情况变化，先正常休息，再按实际位置临时决定住宿。</p><a href="#lodging">查看前六晚住宿安排</a>';
  }
  if(food)food.after(block);else body.appendChild(block);
}
const staySection=$('#stays .booking-order');
if(staySection){const link=document.createElement('a');link.href='#lodging';link.className='lodging-to-list';link.textContent='查看逐晚具体酒店与来源 ↗';staySection.after(link)}
const navFlight=$('.navlinks a[href="#flights"]');
if(navFlight){const link=document.createElement('a');link.href='#lodging';link.textContent='沿途住宿';navFlight.before(link)}
const mobileFlight=$('.mobile-nav a[href="#flights"]');
if(mobileFlight){const link=document.createElement('a');link.href='#lodging';link.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 19V5m18 14v-9H3m0 5h18M6 10V7h6v3"/></svg>住宿';mobileFlight.before(link)}

document.addEventListener('click',event=>{
  const link=event.target.closest('a[href^="#lodging-"]');
  if(!link)return;
  const match=link.getAttribute('href').match(/^#lodging-(?:hotel-([a-z]+)|day-([1-7]))$/);
  if(!match)return;
  if(match[2]){const details=$('#day-'+match[2]);if(details)details.open=true}
});
function resolveHash(){
  const match=location.hash.match(/^#lodging-day-([1-7])$/);
  if(match){const details=$('#day-'+match[1]);if(details)details.open=true}
}
window.addEventListener('hashchange',resolveHash);
resolveHash();

window.tripStayDayMarkdown=day=>{
  const n=Number(day);
  if(n===7)return '### 当晚住宿｜返回汉中\n\n10月7日不另排酒店；若道路或体力情况变化，先正常休息，再按实际位置决定住宿。\n\n';
  const hotel=hotelForDay(n);
  if(!hotel)return '';
  const alternate=(n===3||n===4)?hotels.find(item=>item.id==='ejinbackup'):null;
  return '### 当晚住宿｜'+hotel.name+'\n\n'+hotel.dates+'；'+hotel.type+'；'+hotel.address+'。\n\n'+hotel.reason+'\n\n停车：'+hotel.parking+'\n\n订前核对：'+hotel.check+'\n\n来源：['+hotel.sourceLabel+']('+hotel.source+')'+(hotel.locationSource?'；['+hotel.locationSourceLabel+']('+hotel.locationSource+')':'')+'\n\n'+(alternate?'连住备选：'+alternate.name+'。['+alternate.sourceLabel+']('+alternate.source+')。\n\n':'');
};
window.tripStayMarkdown=()=>{
  let markdown='\n## 沿途住宿与酒店来源\n\n以下六家酒店覆盖五处住宿城市，其中额济纳两家二选一，尚未代订。房间清洁度需要用近期住客图片和评价继续核对；房型、房价、国庆余房及退改条件未核实。停车信息来自所列页面，空位与入口仍需抵达前确认。\n\n';
  for(const hotel of hotels){
    markdown+='### '+hotel.dates+'｜'+hotel.city+'｜'+hotel.name+'\n\n类型：'+hotel.type+'。\n\n位置：'+hotel.address+'。\n\n入选理由：'+hotel.reason+'\n\n停车：'+hotel.parking+'\n\n订前核对：'+hotel.check+'\n\n来源：['+hotel.sourceLabel+']('+hotel.source+')'+(hotel.locationSource?'；['+hotel.locationSourceLabel+']('+hotel.locationSource+')':'')+'\n\n';
  }
  markdown+='10月7日返回汉中，不另排酒店；如需休息或临时过夜，以实际路况和体力为准。\n';
  return markdown;
};
window.tripStayReady=true;
})();
