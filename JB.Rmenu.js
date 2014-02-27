/*
right click menu
JB (c)2014
v 1.1.0
*/

if(typeof JB == 'undefined')
	JB={};
	
//definice default ikonek
JB.Rmenu_default_icons=new function(){
	var o={};
	var def='http://www.dvestezar.cz/!moje_js/add/';

	o.submenu_point=def+'submenu_pointer.png'; // !!! dùležitá položka, ve vlastním seznamu musí existovat, je to odkaz na obrázek šipky podmenu

	var o1={
		ask:'ico_ask.png',
		err:'ico_err.png',
		nfo:'ico_info.png',
		dear:'ico_pzn.png',
		war:'ico_war.png'
	};
	for(var a in o1)
		o[a]=def+o1[a];
		
	def+='menu_ico/';
	var o2={
		copy:'copy.png',
		cut:'cut.png',
		paste:'paste.png',
		del:'del.png',
		trash:'trash.png',
		print:'printer.png',
		exit:'exit.png',
		save:'save.png',
		upl:'',  //upload
		search:'search.png', // hledat
		set:'set.png', //klíè
		set2:'set2.png', //ozubené kolo
		mail:'mail.png',
		rmail:'readed_mail.png',
		refr:'refresh.png',
		lock:'lock.png',
		lock_open:'lock_open.png',
		eye:'eye.png',
		eye_dis:'eye-disable.png',
		pen:'pencil.png'
	};
	for(var a in o2)
		o[a]=def+o2[a];	
	return o;
}

JB.Rmenu = function(params){
	var v_menu=null;
	var v_title=null;
	var created=false;
	var ico_arr=JB.Rmenu_default_icons;
	var onshow;
	
	function create(toto,p){
		if(created!=false)return null;
		if(typeof p=='undefined')
			p={};
		v_menu=JB.x.cel('div',{csN:'JBMenuMain',id:p.id,ob:document.body});
		v_title=JB.x.cel('div',{csN:'JBMenuTitle',ob:v_menu});
		if(typeof p.title!='undefined'){
			toto.title(p.title);
		}else{
			toto.title(null);
		}		
		v_menu.toto=toto;
		jQuery(v_menu).mouseleave(function(){
			this.toto.hide();
		})
		jQuery(v_menu).mouseenter(function(){
			with(jQuery(this)){
				stop(true,true);
				show();
			}
		})
		if(!JB.is.und(p.icosadd)){
			ico_arr=JB.x.merge_objs(JB.Rmenu_default_icons,p.icosadd);
		}else if(!JB.is.und(p.icos)){
			ico_arr=p.icos;
		}
		if(!JB.is.empty(p.onshow)){
			onshow=p.onshow;
		}
		return v_menu;
	}

	function make_item(el,fcsN,ico){
		var o={};
		o.main=JB.x.cel('div',{ob:el,csN:fcsN});
		o.ico=JB.x.cel('div',{ob:o.main,csN:'JBMenuItemIco'});
		o.tx=JB.x.cel('div',{ob:o.main,csN:'JBMenuItemTx'});
		o.sp=JB.x.cel('div',{ob:o.main,csN:'JBMenuItemSp'});
		if(!JB.is.empty(ico)){
			if(ico!=''){
				var x=ico_arr[ico];
				if(!JB.is.und(x))
					o.img=JB.x.cel('img',{ob:o.ico,ad:{src:x}});
			}
		}
		if(JB.is.und(o.img))
			o.ico.innerHTML='&nbsp;';
		return o;
	}
	
	this.showByEvent=function(e,ref){
		this.show(e.pageX,e.pageY,ref,e);
	}
	this.show=function(x,y,ref,e){
		if(!JB.is.empty(onshow)){
			try{
				onshow(e,v_menu,ref);
			}catch(e){
				console.log('!!! JavaScript error - RMenu fn show : '+e)
			}
		}
		with(jQuery(v_menu)){
			css({
				'left':(x+1)+'px',
				'top':y+'px'
			});
			show(200);
		}
	}
	this.hide=function(){
		jQuery(v_menu).delay(100).hide(200);
	}
	this.add = function(p){
		var tx,url,target,x;
		var el=jQuery(v_menu);
		var itm;
		if(el.length<1)
			return false;
			
		//test parametrù
		if(JB.is.und(p))
			p={};
		if(JB.is.und(p.tx))
			p.tx='';
		if(JB.is.und(p.url))
			p.url='';
		if(JB.is.und(p.target))
			p.target='';
		tx=p.tx;
		url=p.url;
		target=p.target;
		
		if(JB.is.und(p.typ)){
			//základní typ
			itm=make_item(v_menu,'JBMenuItem',p.ico);
			itm.main.JBp={url:p.url,target:p.target};

			jQuery(itm.main).click(function(event){
				var p=this.JBp;
				if(typeof p=='undefined'){
					alert('Chyba scriptu');
					return false;
				}
				if(typeof p.url=='string'){
					//jedná se o link
					if(typeof this.JBlink=='undefined')
						this.JBlink=JB.x.a('','','','',{ob:this,csN:'JBMenuItemLink'});
					with(this.JBlink){
						href=p.url;
						target=p.target;
						click(event);
					}
				}else{
					//jedná se funkci
					try{
						p.url(event,this);
					}catch(e){
						console.log('Err JB.Rmenu : JavaScript - user fn onclick');
						alert('Error : ref console')
					}
					this.toto.hide();
				}
			})
		}else if(p.typ=='split'){
			itm={};
			JB.x.cel('div',{ob:v_menu,csN:'JBMenuItemSplit'})
		}else if(p.typ=='sub'){
			//vytvoø podmenu item
			itm=make_item(v_menu,'JBMenuItemSub',p.ico);
			x=JB.x.cel('div',{ob:itm.main,csN:'JBMenuItemSubPoint'});
			x.style.backgroundImage="url('"+ico_arr['submenu_point']+"')";
			itm.main.JBsubmenu=new JB.Rmenu(p.p);
			//nastav akce
			jQuery(itm.main).mouseenter(function(event){
				var pos=jQuery(this).offset();
				pos.left+=jQuery(this).outerWidth()-5;
				this.JBsubmenu.toto.show(pos.left,pos.top);
			});
			jQuery(itm.main).mouseleave(function(event){
				this.JBsubmenu.toto.hide();
			});
		}

		//základní vlastnosti všech
		if(!JB.is.und(p.csN))
			itm.main.className+=p.csN;
		if(!JB.is.und(itm.tx))
			itm.tx.innerHTML=tx;
			
		if(!JB.is.und(itm.main)){
			itm.main.toto=this;
			itm.main.JBMainDiv=v_menu;
			if(!JB.is.und(p.ad))
				JB.x.add_props(itm.main,p.ad);
			itm.main.onmouseover=function(){
				jQuery(this).addClass('JBMenuSelItm');
			};
			itm.main.onmouseout=function(){
				jQuery(this).removeClass('JBMenuSelItm');
			};
		}
		return itm.main;
	}
	
	this.title=function(tx){
		if(JB.is.empty(tx)){
			jQuery(v_title).hide();
		}else{
			jQuery(v_title).show();
			v_title.innerHTML=tx;
		}
	}
	this.clear=function(){
		jQuery(v_menu).children('.JBMenuItemSub').each(function(){
			this.JBsubmenu.toto.clear();//recursive
			jQuery(this.JBsubmenu).remove();
		})
		jQuery(v_menu).children('.JBMenuItem, .JBMenuItemSplit, .JBMenuItemSub, .JBMenuTitle').remove();
	}
	this.bind = function(el,menu,how){
		var bindhow={
			context:'contextmenu',
			click:'click',
			dbl:'dblclick'
		};
		if(JB.is.und(how)){
			how='context';
		}else{
			how=String(how);
		}
		if(!/^((context)|(click)|(dbl))$/i.test(how))
			how='context';
		el.JBRMenu=v_menu;
		jQuery(el).bind(bindhow[how],function(event){
			this.JBRMenu.toto.showByEvent(event,this);
			return false;
		})
	}
	
	//************ inicializuj
	return create(this,params);
}