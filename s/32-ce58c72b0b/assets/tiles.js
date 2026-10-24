// 牌レンダラー v2（雀魂の配色・構造を参照：萬＝黒の漢数字＋赤の萬／筒＝黒と赤の輪／索＝緑の竹／一索＝木と鳥）
// 使い方：<span data-t="m1〜m9|p1〜p9|s1〜s9|zE zS zW zN zH zF zC" data-sz="L|M" data-st="wait|safe|danger|gone"></span> → renderTiles()
var TILE_FONT = "'Yuji Boku','Noto Serif JP',serif";
var BK = '#1E1E1E', RD = '#C4122F', GR = '#1E7B3C';
var P_POS={1:[[50,50]],2:[[50,24],[50,76]],3:[[22,18],[50,50],[78,82]],
 4:[[28,24],[72,24],[28,76],[72,76]],5:[[26,18],[74,18],[50,50],[26,82],[74,82]],
 6:[[28,14],[72,14],[28,50],[72,50],[28,84],[72,84]],
 7:[[18,10],[50,24],[82,38],[28,64],[72,64],[28,90],[72,90]],
 8:[[26,11],[74,11],[26,37],[74,37],[26,63],[74,63],[26,89],[74,89]],
 9:[[14,14],[50,14],[86,14],[14,50],[50,50],[86,50],[14,86],[50,86],[86,86]]};
var P_R={2:13,3:10.5,4:10.5,5:10.2,6:10,7:8.4,8:8.4,9:8.4};
var S_POS={2:[[50,24],[50,76]],3:[[50,24],[22,76],[78,76]],4:[[26,24],[74,24],[26,76],[74,76]],
 5:[[20,24],[80,24],[50,50],[20,76],[80,76]],6:[[18,24],[50,24],[82,24],[18,76],[50,76],[82,76]],
 7:[[50,13],[18,50],[50,50],[82,50],[18,87],[50,87],[82,87]],
 9:[[14,14],[50,14],[86,14],[14,50],[50,50],[86,50],[14,86],[50,86],[86,86]]};
var S_H={2:30,3:29,4:30,5:26,6:30,7:20,9:20};
var KAN=['一','二','三','四','伍','六','七','八','九'];
var HON={E:['東',BK],S:['南',BK],W:['西',BK],N:['北',BK],F:['發',GR],C:['中',RD]};

// 面の内側：x 6〜54, y 7〜73
function fx(p){return 6+p*0.48;} function fy(p){return 7+p*0.66;}
function pin(cx,cy,r,c){
  return '<g><circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.8)+'" fill="#fff" stroke="'+c+'" stroke-width="'+(r*0.38)+'"/>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.42)+'" fill="none" stroke="'+c+'" stroke-width="'+(r*0.16)+'"/>'+
    '<circle cx="'+cx+'" cy="'+cy+'" r="'+(r*0.17)+'" fill="'+c+'"/></g>';
}
function stick(cx,cy,h,c,rot){
  var t=cy-h/2, w=6;
  var s='<g'+(rot?' transform="rotate('+rot+' '+cx+' '+cy+')"':'')+'>'+
    '<rect x="'+(cx-w/2)+'" y="'+t+'" width="'+w+'" height="'+h+'" rx="1.6" fill="'+c+'"/>'+
    '<ellipse cx="'+cx+'" cy="'+(t+1.4)+'" rx="4.6" ry="2.3" fill="'+c+'"/>'+
    '<ellipse cx="'+cx+'" cy="'+(t+h-1.4)+'" rx="4.6" ry="2.3" fill="'+c+'"/>'+
    '<ellipse cx="'+cx+'" cy="'+cy+'" rx="4.4" ry="1.9" fill="'+c+'"/>'+
    '<rect x="'+(cx-0.9)+'" y="'+(t+3.2)+'" width="1.8" height="'+(h/2-4.6)+'" rx=".7" fill="#fff"/>'+
    '<rect x="'+(cx-0.9)+'" y="'+(cy+1.8)+'" width="1.8" height="'+(h/2-4.6)+'" rx=".7" fill="#fff"/></g>';
  return s;
}
function bird(){
  var g='<g>';
  g+='<path d="M30 40 L30 50" stroke="'+GR+'" stroke-width="1.6"/><path d="M26 40 L27 49 M34 40 L33 49" stroke="'+GR+'" stroke-width="1.2"/>';
  g+='<ellipse cx="30" cy="27" rx="15" ry="14" fill="'+GR+'"/>';
  [[23,21],[30,19],[37,21],[21,28],[28,27],[35,27],[39,30],[25,34],[32,34]].forEach(function(p){
    g+='<circle cx="'+p[0]+'" cy="'+p[1]+'" r="2" fill="none" stroke="#fff" stroke-width="1"/>';});
  g+='<path d="M16 52 C20 46 26 46 30 52 L44 48 L38 58 C32 64 22 64 16 58 Z" fill="#fff" stroke="'+BK+'" stroke-width="1.3"/>';
  g+='<path d="M30 52 L41 46 M31 55 L43 51 M31 58 L40 56" stroke="'+BK+'" stroke-width="1"/>';
  g+='<circle cx="16" cy="50" r="3.4" fill="#fff" stroke="'+BK+'" stroke-width="1.3"/><circle cx="15.3" cy="49.5" r=".8" fill="'+BK+'"/>';
  g+='<path d="M12.8 50.2 L9 51.6 L12.9 52" fill="'+RD+'"/>';
  g+='<path d="M24 63 L23 70 M30 63 L31 70" stroke="'+RD+'" stroke-width="1.4"/><path d="M21 70.5 H25 M29 70.5 H33" stroke="'+RD+'" stroke-width="1.4"/>';
  return g+'</g>';
}
function face(code){
  var t=code[0], n=code[1], h='', aka=(code[2]==='r');
  if(t==='m'){
    h='<text x="30" y="34" text-anchor="middle" font-size="30" font-family="'+TILE_FONT+'" fill="'+(aka?RD:BK)+'" stroke="'+(aka?RD:BK)+'" stroke-width="1.3" stroke-linejoin="round">'+KAN[+n-1]+'</text>'+
      '<text x="30" y="70" text-anchor="middle" font-size="33" font-family="'+TILE_FONT+'" fill="'+RD+'" stroke="'+RD+'" stroke-width="1.3" stroke-linejoin="round">萬</text>';
  } else if(t==='p'){
    if(+n===1){
      h='<circle cx="30" cy="40" r="21" fill="#fff" stroke="'+BK+'" stroke-width="3.6"/>'+
        '<circle cx="30" cy="40" r="16.2" fill="none" stroke="'+BK+'" stroke-width="3.2" stroke-dasharray="2.6 1.8"/>'+
        '<circle cx="30" cy="40" r="11" fill="'+RD+'"/><circle cx="30" cy="40" r="8" fill="#fff"/>'+
        '<circle cx="30" cy="40" r="6" fill="none" stroke="'+RD+'" stroke-width="2" stroke-dasharray="1.8 1.2"/><circle cx="30" cy="40" r="2.4" fill="'+RD+'"/>';
    } else {
      var num=+n;
      P_POS[num].forEach(function(p,i){
        var red=(num===3&&i===1)||(num===5&&i===2)||(num===6&&i>=2)||(num===7&&i>=3)||(num===9&&i>=3&&i<=5);
        h+=pin(fx(p[0]),fy(p[1]),P_R[num],(red||aka)?RD:BK);
      });
    }
  } else if(t==='s'){
    var k=+n;
    if(k===1) h=bird();
    else if(k===8){
      h=stick(12,24,28,GR)+stick(48,24,28,GR)+stick(23,24,26,GR,-28)+stick(37,24,26,GR,28)+
        stick(12,56,28,GR)+stick(48,56,28,GR)+stick(23,56,26,GR,28)+stick(37,56,26,GR,-28);
    } else {
      S_POS[k].forEach(function(p,i){
        var red=(k===5&&i===2)||(k===7&&i===0)||(k===9&&(i===1||i===4||i===7));
        h+=stick(fx(p[0]),fy(p[1]),S_H[k],(red||aka)?RD:GR);
      });
    }
  } else if(t==='z'){
    if(n!=='H'){ var z=HON[n];
      h='<text x="30" y="55" text-anchor="middle" font-size="46" font-family="'+TILE_FONT+'" fill="'+z[1]+'" stroke="'+z[1]+'" stroke-width="1.6" stroke-linejoin="round">'+z[0]+'</text>'; }
  }
  return '<svg viewBox="0 0 60 80" aria-hidden="true">'+h+'</svg>';
}
var TILE_NAME={m:'萬',p:'筒',s:'索'}, HON_NAME={E:'東',S:'南',W:'西',N:'北',H:'白',F:'發',C:'中'};
function renderTiles(root){
  (root||document).querySelectorAll('[data-t]').forEach(function(el){
    var code=el.getAttribute('data-t'), st=el.getAttribute('data-st')||'';
    el.className='tile '+(el.getAttribute('data-sz')||'')+(st?' '+st:'');
    el.innerHTML=face(code);
    el.setAttribute('role','img');
    el.setAttribute('aria-label', code[0]==='z'?HON_NAME[code[1]]:(code[2]==='r'?'赤':'')+KAN[+code[1]-1].replace('伍','五')+TILE_NAME[code[0]]);
  });
}
