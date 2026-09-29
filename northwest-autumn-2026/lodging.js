/* Northwest autumn 2026: hotel candidates, not reservations or live inventory. */
(()=>{'use strict';
if(window.tripStayReady)return;
const $=(selector,root=document)=>root.querySelector(selector);
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));

// Parking statements below describe the linked hotel's published listing; a space is not guaranteed.
const hotels=[
  {id:'wuwei',days:[1],dates:'10月1日 · 1晚',city:'武威',name:'武威凉州宾馆',type:'市区宾馆',address:'凉州区东大街159号',reason:'位于武威主城区，适合长途抵达后直接入住；携程页面列明24小时前台。次日从市区继续向张掖出发。',parking:'携程页面列有免费停车场；到店车位与实际出入口仍需确认。',check:'晚到房间保留、所订房型的卫浴与近期卫生反馈。',sourceLabel:'携程｜武威凉州宾馆房源与设施',source:'https://hotels.ctrip.com/hotels/68014774.html'},
  {id:'wuweibinguan',days:[1],dates:'10月1日 · 1晚备选',city:'武威',name:'武威宾馆（步行街文庙店）',type:'市区实用型宾馆',address:'凉州区凤凰路48号',reason:'携程列24小时前台；靠近步行街与文庙，适合10月1日长途晚到后在市区休息。',parking:'携程列免费私人停车场；国庆当晚车位需提前确认。',cleanliness:'截至2026-09-29，携程页面卫生评分4.8/5，9月住客有清洁正面反馈；仍需核对所订房型。',check:'房间保留、房型面积、近期客房照片和停车入口。',sourceLabel:'携程｜武威宾馆房源与评价',source:'https://hotels.ctrip.com/hotels/5315682.html'},
  {id:'wuweihuazhu',days:[1],dates:'10月1日 · 1晚备选',city:'武威',name:'花筑·巷往别院民宿（步行街文庙店）',type:'老城院落民宿',address:'凉州区东大街街道县府巷2栋15号',reason:'小院位于老城区，适合想在抵达后短步行感受当地街巷的人；房量较少。',parking:'携程列免费公共停车场，近期住客称门前可停车；具体车位和入口须确认。',cleanliness:'截至2026-09-29，携程页面卫生评分4.9/5，9月住客有干净整洁的反馈。',check:'前台页面列08:00—22:00，长途晚到必须先确认接待；核对所订房型与洗浴热水。',caution:'近期有住客提到热水不太稳定；仅10间房，连夜赶路时不宜假设随时可入住。',sourceLabel:'携程｜花筑·巷往别院房源与评价',source:'https://hotels.ctrip.com/hotels/133626924.html'},
  {id:'jiayuguan',days:[2],dates:'10月2日 · 1晚',city:'嘉峪关',name:'酒钢宾馆',type:'市区宾馆',address:'雄关西路2号',reason:'位于嘉峪关市区，接机后可直接入住；携程页面列出富强市场、东方百盛等周边位置，次日从市区继续转场。',parking:'携程页面列有免费私人停车场；夜间抵达时应问清入口和车位。',check:'21:15航班落地后的晚到保留、接机到店实际车程。',sourceLabel:'携程｜酒钢宾馆房源与设施',source:'https://hotels.ctrip.com/hotels/439614.html'},
  {id:'jiayuguanquanji',days:[2],dates:'10月2日 · 1晚备选',city:'嘉峪关',name:'全季酒店（嘉峪关迎宾湖店）',type:'连锁酒店',address:'嘉峪关市迎宾西路1459号',reason:'迎宾湖附近的连锁选项，适合晚间接机后直接休息；页面列有家庭房。',parking:'携程列免费公共停车场及充电车位；订前确认施工状态和夜间入口。',cleanliness:'截至2026-09-29，携程页面卫生评分4.8/5，9月住客有房间干净的反馈。',check:'21:15落地后的房间保留、家庭房实际床型、停车入口。',caution:'曾有门口施工反馈，部分住客对早餐种类与家庭房床型有保留。',sourceLabel:'携程｜全季迎宾湖店房源与评价',source:'https://hotels.ctrip.com/hotels/120353998.html'},
  {id:'jiayuguanhaiyou',days:[2],dates:'10月2日 · 1晚备选',city:'嘉峪关',name:'海友酒店（嘉峪关富强市场店）',type:'经济连锁酒店',address:'嘉峪关市兰新西路730号',reason:'位于市区，靠近富强市场，适合作为控制住宿预算的备选。',parking:'携程列免费私人停车场；近期住客反馈有叠停可能，晚到先问车位。',cleanliness:'截至2026-09-29，携程页面卫生评分4.8/5，9月有干净整洁的住客反馈。',check:'夜间接机后停车空位、房间面积、电梯与早餐安排。',caution:'近期住客提到部分房间较小、停车可能叠停；更重视空间时可优先比较前两家。',sourceLabel:'携程｜海友富强市场店房源与评价',source:'https://hotels.ctrip.com/hotels/122013757.html'},
  {id:'ejin',days:[3,4],dates:'10月3—4日 · 连住2晚',city:'额济纳',name:'额济纳旗大漠酒店',type:'达来呼布镇酒店',address:'额济纳旗军民东街7号1栋110号',reason:'两晚住同一处，10月4日游胡杨林不必重新搬行李。酒店位于镇区；胡杨林有不同入口，本页驾车查询采用西大门游客中心，最终按所购门票和开放入口导航。',parking:'携程页面列有免费私人停车场；国庆车辆集中时先问能否连续两晚停车。',check:'同一酒店连续两晚的房间、热水、保暖和退改条件。',sourceLabel:'携程｜额济纳旗大漠酒店房源与设施',source:'https://hotels.ctrip.com/hotels/112379395.html'},
  {id:'ejinbackup',days:[3,4],dates:'10月3—4日 · 连住2晚备选',city:'额济纳',name:'额济纳旗诺金酒店',type:'达来呼布镇酒店',address:'额济纳旗军民东街；准确门牌以预订页为准',reason:'与大漠酒店同在达来呼布镇，可作为额济纳连住房态不足时的备选。携程近期住客评价有客房清洁和停车的具体反馈，订前仍须核对最新评价。',parking:'携程页面列有免费私人停车；国庆空位和入口须再问。页面充电设施信息与住客评价有冲突，不承诺可充电。',check:'连续两晚同房、热水、保暖、近期卫生图片和退改条件。',sourceLabel:'携程｜额济纳旗诺金酒店房源与评价',source:'https://hotels.ctrip.com/hotels/80892994.html'},
  {id:'ejinrujia',days:[3,4],dates:'10月3—4日 · 连住2晚备选',city:'额济纳',name:'如家云上四季酒店（额济纳旗胡杨林景区西大门店）',type:'近西大门连锁酒店',address:'达来呼布镇金胡杨国际风情商业街路5号1栋',reason:'靠近胡杨林西大门；9月住客称可步行到入口。适合连续两晚住在景区一侧，但实际入园口须按门票核对。',parking:'携程列免费私人停车场，9月住客提到停车场较大；国庆空位仍需确认。',cleanliness:'2026年9月住客评价提到房间干净、热水充足。',check:'10月3日入住至5日退房同一房型、早餐安排、景区实际入园口。',caution:'页面称不提供早餐；电梯设施清单与住客反馈冲突，订前确认楼层和电梯。',sourceLabel:'携程｜如家云上四季额济纳店房源与评价',source:'https://hotels.ctrip.com/hotels/122376974.html'},
  {id:'ejinyihao',days:[3,4],dates:'10月3—4日 · 连住2晚备选',city:'额济纳',name:'额济纳旗亿豪大酒店',type:'镇区酒店',address:'达来呼布路以西、胡杨街以北；导航以房源地图为准',reason:'位于达来呼布镇区，携程列24小时前台与餐厅，适合希望在酒店周边完成晚餐和休息的人。',parking:'携程列免费停车场，夏季住客有车位较多的反馈；国庆仍须确认。',cleanliness:'2026年7—8月住客评价有房间干净的反馈，也有卫浴及地毯陈旧的意见。',check:'连续两晚同房、具体导航入口、目标房型近期照片与热水。',caution:'地址没有具体门牌，部分设施新旧评价不一致；不要仅凭酒店名称选择。',sourceLabel:'携程｜额济纳旗亿豪大酒店房源与评价',source:'https://hotels.ctrip.com/hotels/80316265.html'},
  {id:'yinchuan',days:[5],dates:'10月5日 · 1晚',city:'银川',name:'银川中心智选假日酒店',type:'国际连锁品牌酒店',address:'金凤区亲水大街清水湾幸福枫景花园17号楼',reason:'自驾线完成河东机场送机后再进银川市区入住；次日从酒店前往中卫。IHG官网给出明确地址，便于倒排机场与酒店间的行车时间。',parking:'IHG官网列有地面、地下停车场，约180个车位；车位及当日收费规则应向酒店确认。',check:'送机后晚到保留、次日早餐供应时间和中卫方向出城路线。',sourceLabel:'IHG官网｜银川中心智选假日交通与停车',source:'https://www.ihg.com/holidayinnexpress/hotels/cn/zh/yinchuan/incyd/hoteldetail/directions'},
  {id:'yinchuanatour',days:[5],dates:'10月5日 · 1晚备选',city:'银川',name:'银川砂之船奥莱丽景南街亚朵酒店',type:'城南连锁酒店',address:'兴庆区六盘山东路砂之船奥莱A5号门北侧约50米',reason:'城南位置便于补给和次日前往中卫；适合送机后希望住在大型商业区附近的人。',parking:'携程列免费公共停车场，9月住客提到自驾停车方便；晚间空位须确认。',cleanliness:'2026年9月住客有房间干净的反馈。',check:'机场送机后的晚到保留、停车入口、次日出城路线。',caution:'不在银川老城，部分住客反馈窗景较局促。',sourceLabel:'携程｜银川砂之船奥莱亚朵房源与评价',source:'https://hotels.ctrip.com/hotels/132150921.html'},
  {id:'yinchuanji',days:[5],dates:'10月5日 · 1晚备选',city:'银川',name:'全季酒店（银川宁安大街华雁湖畔店）',type:'金凤区连锁酒店',address:'金凤区花样年华苑北区2号楼',reason:'金凤区位置适合送机后入住、次日向中卫出发；可比较房型和退改条件。',parking:'携程列免费私人停车场；到店车位和入口须确认。',cleanliness:'截至2026-09-29，携程页面卫生评分4.9/5；8—9月有清洁正面评价，也有个别卫生负评。',check:'晚到房间保留、所订房型近期卫生图片和停车方式。',caution:'评价并非全为正面，入住时应检查目标房间。',sourceLabel:'携程｜银川宁安大街全季房源与评价',source:'https://hotels.ctrip.com/hotels/118890429.html'},
  {id:'zhongwei',days:[6],dates:'10月6日 · 1晚',city:'中卫',name:'中卫沙坡头希尔顿欢朋酒店',type:'国际连锁品牌酒店',address:'中卫市区，鼓楼东街一带；精确入口以官网地图为准',reason:'沙坡头游览后返回中卫市区休息，次日从中卫直接返汉中。希尔顿官网将酒店列在市区商圈，景区约17公里，不把它当成景区内住宿。',parking:'希尔顿官网列有免费现场自助停车；晚间空位和进出方式需现场确认。',check:'晚到保留、具体导航入口与次日清晨出发安排。',sourceLabel:'希尔顿官网｜中卫沙坡头希尔顿欢朋酒店设施',source:'https://www.hilton.com/zh-hans/hotels/zhyzghx-hampton-zhongwei-shapotou/hotel-info/',locationSourceLabel:'希尔顿官网｜酒店位置与交通',locationSource:'https://www.hilton.com/en/hotels/zhyzghx-hampton-zhongwei-shapotou/hotel-location/'},
  {id:'zhongweiji',days:[6],dates:'10月6日 · 1晚备选',city:'中卫',name:'全季酒店（中卫丰安东路店）',type:'市区连锁酒店',address:'沙坡头区怀远南街黄河花园三期72号楼',reason:'市区偏南，适合重视自驾停车和次日出城顺畅的人；晚餐如去鼓楼一带可能仍需开车。',parking:'携程列两处免费私人停车场，8月住客有停车方便的反馈；节日车位仍需问。',cleanliness:'截至2026-09-29，携程页面卫生评分4.8/5，8月有客房整洁的住客反馈。',check:'10月6日入住、次日早出发的早餐与停车场出入口。',sourceLabel:'携程｜中卫丰安东路全季房源与评价',source:'https://hotels.ctrip.com/hotels/106868173.html'},
  {id:'zhongweiatour',days:[6],dates:'10月6日 · 1晚备选',city:'中卫',name:'中卫鼓楼步行街亚朵酒店',type:'鼓楼商圈连锁酒店',address:'沙坡头区鼓楼北街2号',reason:'位于鼓楼和夜市附近，适合沙坡头游后想步行晚餐、逛市中心的人。',parking:'携程列收费公共停车场；费用与夜间出入方式需按入住日期确认。',cleanliness:'截至2026-09-29，携程页面卫生评分4.9/5，8—9月有正面评价，也有个别清洁遗漏反馈。',check:'收费停车位置、深夜出入与次日清晨取车、目标房型卫生。',caution:'市中心节假日车流可能影响进出；停车便利性不及明确列免费私人停车的备选。',sourceLabel:'携程｜中卫鼓楼步行街亚朵房源与评价',source:'https://hotels.ctrip.com/hotels/129146242.html'}
];
const cityGroups=[
  {id:'wuwei',city:'武威',date:'10月1日 · 1晚',note:'长途抵达，优先确认晚到保留与停车入口。'},
  {id:'jiayuguan',city:'嘉峪关',date:'10月2日 · 1晚',note:'21:15航班落地后接机，优先确认深夜入住。'},
  {id:'ejin',city:'额济纳',date:'10月3—4日 · 连住2晚',note:'同一家连续住两晚，重点确认热水、停车与退改。'},
  {id:'yinchuan',city:'银川',date:'10月5日 · 1晚',note:'先送银川河东机场，再进市区入住。'},
  {id:'zhongwei',city:'中卫',date:'10月6日 · 1晚',note:'游览沙坡头后入住，次日清晨返汉中。'}
];
const routeHotelIds=new Set(['wuwei','jiayuguan','ejin','yinchuan','zhongwei']);
const hotelsForDay=day=>hotels.filter(hotel=>hotel.days.includes(day));
const hotelsForCity=city=>hotels.filter(hotel=>hotel.city===city);
const css=`
.lodging-section{background:#f8f5ea;border-block:1px solid #e2dfcf}.lodging-section .section-heading{margin-bottom:23px}.lodging-lead{max-width:95ch;font-size:14px;line-height:1.9;color:#52624c}.lodging-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:17px;margin-top:25px}.lodging-card{background:#fffefa;border:1px solid #dfdfd3;border-radius:7px;padding:23px;min-width:0;scroll-margin-top:100px;break-inside:avoid}.lodging-card h3{font-family:'PingFang SC','Microsoft YaHei','Noto Sans CJK SC',sans-serif;font-size:20px;line-height:1.5;color:#214532}.lodging-card .lodging-date{font-size:12px;color:#846a30;letter-spacing:.04em}.lodging-card .lodging-type{font-size:12px;color:#607159;margin-top:5px}.lodging-card dl{display:grid;grid-template-columns:67px minmax(0,1fr);gap:8px 10px;margin:17px 0 18px;font-size:13px;line-height:1.8}.lodging-card dt{font-weight:650;color:#344c35}.lodging-card dd{margin:0;color:#52624e;overflow-wrap:anywhere}.lodging-card a,.lodging-day a,.lodging-to-list{display:inline-flex;align-items:center;min-height:42px;font-size:13px;color:#28553a;text-decoration:underline;text-underline-offset:3px;overflow-wrap:anywhere}.lodging-card a:hover,.lodging-day a:hover{color:#886710}.lodging-notice{font-size:12px;line-height:1.9;color:#68725b;margin-top:23px}.lodging-day{margin-top:18px;background:#eaf1e8;border-left:3px solid #60805e;border-radius:2px;padding:17px 21px;scroll-margin-top:100px}.lodging-day h4{font-size:16px;line-height:1.6;color:#2a4936}.lodging-day p{font-size:13px;line-height:1.9;color:#516451;margin-top:8px}.lodging-day .lodging-mini-meta{font-size:12px;color:#637159}.lodging-day a{margin-top:6px}.lodging-day-final{background:#f3f1e7;border-left-color:#aa9655}.lodging-to-list{margin-top:11px}.navlinks a[href="#lodging"]{white-space:nowrap}
@media(max-width:1000px){.navlinks a[href="#lodging"]{display:none}}
@media(max-width:640px){.lodging-grid{grid-template-columns:1fr}.lodging-card{padding:19px}.lodging-card h3{font-size:18px}.lodging-card dl{grid-template-columns:60px minmax(0,1fr);font-size:12px}.lodging-lead{font-size:13px}.lodging-day{padding:15px 14px}.lodging-day h4{font-size:15px}.lodging-day p{font-size:12px}}
@media print{.lodging-section{background:white;page-break-before:always}.lodging-grid{grid-template-columns:1fr 1fr;gap:10px}.lodging-card{padding:12px;border-color:#aaa}.lodging-card dl{font-size:9pt;line-height:1.5;margin:9px 0}.lodging-card a,.lodging-day a,.lodging-to-list{display:none}.lodging-day{background:white;border:1px solid #aaa;break-inside:avoid;padding:11px}.lodging-notice{font-size:9pt}}
`;
const extraCss=`
.lodging-city-nav{display:flex;flex-wrap:wrap;gap:9px;margin:21px 0 10px}.lodging-city-nav a{display:inline-flex;align-items:center;min-height:38px;padding:7px 14px;border:1px solid #c7d4c2;border-radius:999px;color:#28553a;font-size:13px;text-decoration:none}.lodging-city-nav a:hover{background:#e9efe4}.lodging-city{scroll-margin-top:95px;padding:24px 0 6px;border-top:1px solid #dddccf}.lodging-city-heading{display:flex;align-items:baseline;flex-wrap:wrap;gap:8px 18px}.lodging-city-heading h3{font-size:24px;color:#214532}.lodging-city-heading p{font-size:13px;line-height:1.7;color:#607159}.lodging-city .lodging-grid{margin-top:16px}.lodging-tag{display:inline-block;margin:10px 0 0;padding:4px 9px;background:#edf2e8;border-radius:3px;color:#526d4f;font-size:11px}.lodging-tag-alt{background:#f1ecdf;color:#7b683d}.lodging-choice-list{list-style:none;margin:10px 0 0;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}.lodging-choice-list li{background:#fffefa;border:1px solid #dbe4d7;border-radius:4px;padding:10px 13px;min-width:0}.lodging-choice-list a{min-height:28px;margin:0;font-weight:650}.lodging-choice-list small{display:block;margin-top:3px;color:#687361;font-size:11px;line-height:1.6}.lodging-day-note{font-size:12px!important;color:#687361!important}
@media(max-width:640px){.lodging-city{padding-top:19px}.lodging-city-heading h3{font-size:20px}.lodging-choice-list{grid-template-columns:1fr}.lodging-city-nav a{font-size:12px;min-height:34px;padding:5px 11px}}
@media print{.lodging-city{break-before:page}.lodging-city-nav{display:none}.lodging-choice-list{grid-template-columns:1fr 1fr}.lodging-choice-list li{padding:6px;border-color:#aaa}}
`;
const style=document.createElement('style');
style.id='trip-lodging-style';
style.textContent=css+extraCss;
document.head.appendChild(style);

function hotelCard(hotel){
  const rows=[['类型',hotel.type],['位置',hotel.address],['选择理由',hotel.reason],['停车',hotel.parking],['预订前核对',hotel.check]];
  if(hotel.cleanliness)rows.push(['卫生线索',hotel.cleanliness]);
  if(hotel.caution)rows.push(['留意',hotel.caution]);
  const tag=routeHotelIds.has(hotel.id)?'本页高德路线测算使用':'同城备选';
  return `<article class="lodging-card" id="lodging-hotel-${esc(hotel.id)}" aria-labelledby="lodging-title-${esc(hotel.id)}"><p class="lodging-date">${esc(hotel.dates)} · ${esc(hotel.city)}</p><h3 id="lodging-title-${esc(hotel.id)}">${esc(hotel.name)}</h3><p class="lodging-type">${esc(hotel.type)}</p><span class="lodging-tag${routeHotelIds.has(hotel.id)?'':' lodging-tag-alt'}">${tag}</span><dl>${rows.map(([term,description])=>`<dt>${esc(term)}</dt><dd>${esc(description)}</dd>`).join('')}</dl><a href="${esc(hotel.source)}" target="_blank" rel="noopener noreferrer">${esc(hotel.sourceLabel)} ↗</a>${hotel.locationSource?`<br><a href="${esc(hotel.locationSource)}" target="_blank" rel="noopener noreferrer">${esc(hotel.locationSourceLabel)} ↗</a>`:''}</article>`;
}
const section=document.createElement('section');
section.id='lodging';
section.className='section lodging-section';
section.setAttribute('aria-labelledby','lodging-title');
section.innerHTML=`<div class="wrap"><div class="section-heading"><div><span class="subhead">六晚，五处落脚城市</span><h2 id="lodging-title">沿途住宿备选</h2><p>每个过夜城市提供多家酒店比较；额济纳要在同一家连续住10月3、4日两晚。10月7日返抵汉中后不另排酒店。</p></div></div><p class="lodging-lead">以下${hotels.length}家酒店按城市列出位置、停车与选择理由。标记“本页高德路线测算使用”的酒店只是行驶里程示例，未代订；换选酒店后要重新导航。房间清洁度需查看近期住客图片和评价，国庆房价、余房、停车空位和退改规则以实际预订页面及酒店确认为准。</p><nav class="lodging-city-nav" aria-label="按城市查看酒店">${cityGroups.map(group=>`<a href="#lodging-city-${group.id}">${group.city} · ${hotelsForCity(group.city).length}家</a>`).join('')}</nav>${cityGroups.map(group=>`<section class="lodging-city" id="lodging-city-${group.id}" aria-labelledby="lodging-city-title-${group.id}"><div class="lodging-city-heading"><h3 id="lodging-city-title-${group.id}">${group.city}</h3><p>${group.date} · ${group.note}</p></div><div class="lodging-grid">${hotelsForCity(group.city).map(hotelCard).join('')}</div></section>`).join('')}<p class="lodging-notice">停车信息来自各酒店对应的房源页或官网设施页，表示页面所列设施，不保证抵达时有空位。10月2日晚到嘉峪关、10月3—4日额济纳连住及10月5日送机后的入住，请分别确认房间保留和停车入口。</p></div>`;
const insertionPoint=$('#flights')||$('#stays');
if(insertionPoint)insertionPoint.before(section);

for(let day=1;day<=7;day++){
  const food=$('#food-day-'+day);
  const body=$('#day-'+day+' .day-body');
  if(!body)continue;
  const block=document.createElement('section');
  block.id='lodging-day-'+day;
  block.className='lodging-day'+(day===7?' lodging-day-final':'');
  const choices=hotelsForDay(day);
  if(choices.length){
    const label=day===4?'继续连住':'今晚住宿';
    const city=choices[0].city;
    block.innerHTML=`<h4>${label}｜${esc(city)} ${choices.length}选1</h4><p class="lodging-mini-meta">${esc(choices[0].dates)} · ${day===3||day===4?'务必同一家连住两晚':'请按入住日期核对'}</p><ul class="lodging-choice-list">${choices.map(hotel=>`<li><a href="#lodging-hotel-${esc(hotel.id)}">${esc(hotel.name)} ↗</a><small>${esc(hotel.type)} · ${esc(hotel.address)}</small></li>`).join('')}</ul><p class="lodging-day-note">高德里程示例使用${esc(choices.find(hotel=>routeHotelIds.has(hotel.id))?.name||choices[0].name)}；选其他酒店后按实际地址重新导航。停车、房间清洁度与国庆余房见下方各酒店来源。</p>`;
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
  const choices=hotelsForDay(n);
  if(!choices.length)return '';
  let markdown='### 当晚住宿｜'+choices[0].city+' '+choices.length+'选1\n\n';
  if(n===3||n===4)markdown+='额济纳需在同一家酒店连续预订10月3、4日两晚。\n\n';
  for(const hotel of choices){
    markdown+='- **'+hotel.name+'**（'+hotel.type+'；'+hotel.address+'）'+(routeHotelIds.has(hotel.id)?'【高德路线测算使用】':'【同城备选】')+'。'+hotel.reason+' 停车：'+hotel.parking+(hotel.cleanliness?' 卫生线索：'+hotel.cleanliness:'')+' 订前核对：'+hotel.check+(hotel.caution?' 留意：'+hotel.caution:'')+' 来源：['+hotel.sourceLabel+']('+hotel.source+')'+(hotel.locationSource?'；['+hotel.locationSourceLabel+']('+hotel.locationSource+')':'')+'\n';
  }
  return markdown+'\n选择不同酒店后须按实际地址重新导航；国庆房价、余房和停车空位未实时确认。\n\n';
};
window.tripStayMarkdown=()=>{
  let markdown='\n## 沿途住宿与酒店来源\n\n以下'+hotels.length+'家酒店覆盖五处住宿城市，额济纳须在同一家连续预订两晚，尚未代订。带“高德路线测算使用”标记的酒店只是里程计算示例，换选酒店后须重新导航。房间清洁度需查看近期住客图片和评价；房型、房价、国庆余房和退改规则未实时确认。停车设施信息来自所列页面，空位与入口仍需抵达前确认。\n\n';
  for(const group of cityGroups){
    markdown+='### '+group.date+'｜'+group.city+'｜'+hotelsForCity(group.city).length+'家可选\n\n'+group.note+'\n\n';
    for(const hotel of hotelsForCity(group.city)){
      markdown+='#### '+hotel.name+(routeHotelIds.has(hotel.id)?'｜高德路线测算使用':'｜同城备选')+'\n\n类型：'+hotel.type+'。\n\n位置：'+hotel.address+'。\n\n选择理由：'+hotel.reason+'\n\n停车：'+hotel.parking+'\n\n'+(hotel.cleanliness?'卫生线索：'+hotel.cleanliness+'\n\n':'')+'订前核对：'+hotel.check+'\n\n'+(hotel.caution?'留意：'+hotel.caution+'\n\n':'')+'来源：['+hotel.sourceLabel+']('+hotel.source+')'+(hotel.locationSource?'；['+hotel.locationSourceLabel+']('+hotel.locationSource+')':'')+'\n\n';
    }
  }
  markdown+='10月7日返回汉中，不另排酒店；如需休息或临时过夜，以实际路况和体力为准。\n';
  return markdown;
};
window.tripStayReady=true;
})();
