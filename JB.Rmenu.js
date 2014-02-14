/*
menu pro right click
JB (c)2014
v 1.0.0

	- create	: vytvoøí DOM menu je voláno pøi inicializaci, následná volání nemají efekt
	- show		: zobrazí vytvoøené menu na daných souøadnicích
	- showByEvent : jako pøedchozí ale parametr je jen jeden a to event myši, ze kterého si souøadnice veme
	- add		: pøidá položku do menu
	- clear		: smaže položky v menu
	- title		: nastaví titulek menu
	
	použití
	
	var menu=new JB.Rmenu(parmas) params viz funkce create
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
	
	function create(toto,p){
		/* je voláno pøi vytváøení objektu !!!!
		vytvoøí menu a vrátí jej jako element
		p=parametry
			.title	= pokud je zadán, tak bude vytvoøen nadpis tabulky
			.id		= pokud je zadáno tak bude pøiøazeno elementu menu toto ID
			.icos	= objekt ikon, pokud není zadáno je použito default pole v 'JB.Rmenu.default_icons'
						{'ico_name1':'ico_url1','ico_name2':'ico_url2',....}
					pokud je icosadd zadáno tak je toto ignorováno
			.icosadd= jakopøedchozí ale tento objekt je pøidán k default ikonám a použito, icos je ognorováno
			
		vrací odkaz na hlavní DIV elemet menu
		*/
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
		return v_menu;
	}

	function make_item(el,fcsN,ico){
		/* vytvoøí item v menu a pøipojí jej k el
			el = objekt ve kterém je vytvoøen øádek
			fcsN = název classname øádku
			ico = název ikony z objektu ikon
				pokud nezadáno, null, nebo '' tak není vytvoøena
		
			vrací objekt
			.main = je hlavní div	csn= csN (JBMenuItemSub / JBMenuItem)
			.ico = je div icony		csn= JBMenuItemIco
			.tx = span textu		csn= JBMenuItemTx   obálka spanu DI má class JBMenuItemTxDiv
			.sp = div mezery		csn= JBMenuItemSp
			.img = pokud je zadána ikona a existuje v poli, tak obsahuje element img v divu ico
			
			'div sub' existuje jen pokud se jedná odkaz na podmenu a má csn 'JBMenuItemSubPoint'
					tento div je pøidán až následnì v rutine add
			
			|div main ----------------------------------------|
			| |div ico--||div tx-------||div sp--||div sub--| |
			|-------------------------------------------------|
		*/
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
	
	this.showByEvent=function(e){
		//jen pomocná pro následující funkce
		//e je event myši
		this.show(e.pageX,e.pageY);
	}
	this.show=function(x,y){
		/* zobrazí menu
			x=pozice z leva v pixelech relativnì od levého horního rohu stránky
			y=pozice z vrchu pixelech relativnì od levého horního rohu stránky
		*/
		with(jQuery(v_menu)){
			css({
				'left':(x+1)+'px',
				'top':y+'px'
			});
			show(200);
		}
	}
	this.hide=function(){
		//x= int v ms animace skrytí, jako v jQuery
		jQuery(v_menu).delay(100).hide(200);
	}
	this.add = function(p){
	/* funkce pøidá øádek do menu
		p = parametry pro všechny typy
			p.csN = pokud zadáno tak je ke classname DIV elementu JBMenuItem pøidán tento text
			p.typ = - když nezadáno tak normální øádek odkaz/funkce
					- když = 'split' tak bude vytvoøen øádek oddìlovaè s classname "JBMenuItemSplit"
					- když = 'sub' tak bude vytvoøeno submenu s classname "JBMenuItemSub"
							v tomto øádku je také vytvoøena DIV s class 'JBMenuItemSubPoint' kde je zobrazena šipka na submenu
			p.width = (integer) pokud není zadáno tak není použito, jinak šíøka menu v px
					
			'p' parametry pro default typ
				p.tx = text øádku
				p.url = pokud string tak URL, pokud objekt tak funkce a není brán v potaz target 
				p.target = funkce jako u html linku
				p.ico = název ikony z pole ikon pøi vytváøení menu

			'p' parametry pro 'sub' typ
				p.tx = text øádku
				p.wait = (integer) default 0, 0 okamžité zobrazení submenu, jinak èas zpoždìní zobrazení v ms
				p.p = parametry pro submenu jako u funkce create
				p.ico = název ikony z pole ikon pøi vytváøení menu
				
			'p' parametry pro 'split' typ
				nemá parametry
			
		vrací odkaz na vytvoøený element
	*/
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
			itm.main.toto=this;
			itm.main.JBMainDiv=v_menu;

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
						p.url(event);
					}catch(e){
						alert('Chyba scriptu - user fn');
					}
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
			itm.main.JBparentmenu=v_menu;
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
			itm.main.onmouseover=function(){
				jQuery(this).addClass('JBMenuSelItm');
				//jQuery(this).JBMainDiv.show();
			};
			itm.main.onmouseout=function(){
				jQuery(this).removeClass('JBMenuSelItm');
				//jQuery(this).JBMainDiv.hide(200);
			};
		}
		return itm.main;
	}
	
	this.title=function(tx){
		//nastaví title menu
		//pokud je tx null tak skryje title
		if(JB.is.empty(tx)){
			jQuery(v_title).hide();
		}else{
			jQuery(v_title).show();
			v_title.innerHTML=tx;
		}
	}
	this.clear=function(){
		//smaže všechny itemy z menu
		var i=jQuery(v_menu).children('.JBMenuItemSub');
		if(i.length>0)
			for(var a=0;a<i.length;a++){
				i[a].JBsubmenu.toto.clear();
				jQuery(i[a].JBsubmenu).remove();
			}
		jQuery(v_menu).children('.JBMenuItem, .JBMenuItemSplit, .JBMenuItemSub').remove();
	}
	
	
	//************ inicializuj
	return create(this,params);
}