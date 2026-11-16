(function(){
  var KEY='dg_hl_'+location.pathname, saved=null, range=null, timer=0;
  var colors=['hl-y','hl-g','hl-p','hl-b'];

  var bar=document.createElement('div');
  bar.id='dg-hlbar';
  colors.forEach(function(c){var b=document.createElement('button');b.type='button';b.className=c;b.title='Highlight';bar.appendChild(b)});
  var x=document.createElement('button');x.type='button';x.className='hl-x';x.textContent='\u2715';x.title='លុប highlight';bar.appendChild(x);
  document.body.appendChild(bar);

  function body(){return document.querySelector('.post-body')}
  function inReader(n){var o=document.getElementById('dgbk-overlay');return o&&o.contains(n)}
  function load(){try{return localStorage.getItem(KEY)}catch(e){return null}}
  function store(){
    var b=body();if(!b)return;
    try{
      if(b.querySelectorAll('mark.dg-hl').length){localStorage.setItem(KEY,b.innerHTML)}
      else{localStorage.removeItem(KEY)}
    }catch(e){}
  }
  function hide(){bar.classList.remove('on');range=null}

  function apply(cls){
    var b=body();if(!range||!b)return;
    var r=range,texts=[];
    var root=r.commonAncestorContainer.nodeType===3?r.commonAncestorContainer.parentNode:r.commonAncestorContainer;
    var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null),n;
    while((n=w.nextNode())){
      if(r.intersectsNode(n)&&b.contains(n)&&n.nodeValue.trim()!==''&&!n.parentNode.closest('script,style,input,textarea,.qz-modal,.hito-audio')){texts.push(n)}
    }
    texts.forEach(function(t){
      var s=(t===r.startContainer)?r.startOffset:0;
      var e=(t===r.endContainer)?r.endOffset:t.nodeValue.length;
      if(s===e)return;
      var part=t;
      if(e<part.nodeValue.length)part.splitText(e);
      if(s>0)part=part.splitText(s);
      var m=document.createElement('mark');
      m.className='dg-hl '+cls;
      part.parentNode.insertBefore(m,part);
      m.appendChild(part);
    });
    var sel=window.getSelection();if(sel)sel.removeAllRanges();
    hide();store();
  }
  function remove(){
    var b=body();if(!range||!b)return;
    var marks=b.querySelectorAll('mark.dg-hl');
    for(var i=0;i<marks.length;i++){
      if(range.intersectsNode(marks[i])){
        var p=marks[i].parentNode;
        while(marks[i].firstChild)p.insertBefore(marks[i].firstChild,marks[i]);
        p.removeChild(marks[i]);p.normalize();
      }
    }
    var sel=window.getSelection();if(sel)sel.removeAllRanges();
    hide();store();
  }

  bar.addEventListener('mousedown',function(e){e.preventDefault()});
  bar.addEventListener('touchstart',function(e){e.stopPropagation()},{passive:true});
  bar.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b||!range)return;
    if(b.classList.contains('hl-x')){remove();return}
    for(var i=0;i<colors.length;i++){if(b.classList.contains(colors[i])){apply(colors[i]);return}}
  });

  function check(){
    var b=body(),sel=window.getSelection();
    if(!b||!sel||sel.rangeCount===0||sel.isCollapsed){hide();return}
    var r=sel.getRangeAt(0);
    if(!b.contains(r.commonAncestorContainer)||inReader(r.commonAncestorContainer)){hide();return}
    range=r.cloneRange();
    var rect=r.getBoundingClientRect();
    var top=rect.top-56;if(top<130)top=rect.bottom+14;
    var left=rect.left+rect.width/2-100;
    left=Math.max(8,Math.min(left,window.innerWidth-220));
    bar.style.top=top+'px';bar.style.left=left+'px';
    bar.classList.add('on');
  }
  document.addEventListener('selectionchange',function(){
    clearTimeout(timer);timer=setTimeout(check,250);
  });

  /* ស្តារ highlight ពេល Post លេចឡើង (Post ត្រូវបានបញ្ចូលដោយ JS) */
  var tries=0,t=setInterval(function(){
    tries++;
    var b=body();
    if(b){
      clearInterval(t);
      saved=load();
      if(saved&&b.querySelectorAll('mark.dg-hl').length===0){
        /* ស្តារតែពេល HTML ដើមមិនបានប្តូរ (ប្រៀបធៀបអត្ថបទ) */
        var tmp=document.createElement('div');tmp.innerHTML=saved;
        if(tmp.textContent.replace(/\s+/g,'')===b.textContent.replace(/\s+/g,'')){b.innerHTML=saved}
      }
    }else if(tries>40){clearInterval(t)}
  },250);
})();