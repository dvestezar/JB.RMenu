/*
menu pro right click
JB (c)2014
v 1.0.0

	- create	: vytvo�� DOM menu je vol�no p�i inicializaci, n�sledn� vol�n� nemaj� efekt
	- show		: zobraz� vytvo�en� menu na dan�ch sou�adnic�ch
	- showByEvent : jako p�edchoz� ale parametr je jen jeden a to event my�i, ze kter�ho si sou�adnice veme
	- add		: p�id� polo�ku do menu
	- clear		: sma�e polo�ky v menu
	- title		: nastav� titulek menu
	
	pou�it�
	
	var menu=new JB.Rmenu(parmas) params viz funkce create
*/

if(typeof JB == 'undefined')
	JB={};
	
//definice default ikonek
JB.Rmenu_default_icons=new function(){
	var o={};
	var def='http://www.dvestezar.cz/!moje_js/add/';

	o.submenu_point=def+'submenu_pointer.png'; // !!! d�le�it� polo�ka, ve vlastn�m seznamu mus� existovat, je to odkaz na obr�zek �ipky podmenu

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
		set:'set.png', //kl��
		set2:'set2.png', //ozuben� kolo
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
		/* je vol�no p�i vytv��en� objektu !!!!
		vytvo�� menu a vr�t� jej jako element
		p=parametry
			.title	= pokud je zad�n, tak bude vytvo�en nadpis tabulky
			.id		= pokud je zad�no tak bude p�i�azeno elementu menu toto ID
			.icos	= objekt ikon, pokud nen� zad�no je pou�ito default pole v 'JB.Rmenu.default_icons'
						{'ico_name1':'ico_url1','ico_name2':'ico_url2',....}
					pokud je icosadd zad�no tak je toto ignorov�no
			.icosadd= jakop�edchoz� ale tento objekt je p�id�n k default ikon�m a pou�ito, icos je ognorov�no
			
		vrac� odkaz na hlavn� DIV elemet menu
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
		/* vytvo�� item v menu a p�ipoj� jej k el
			el = objekt ve kter�m je vytvo�en ��dek
			fcsN = n�zev classname ��dku
			ico = n�zev ikony z objektu ikon
				pokud nezad�no, null, nebo '' tak nen� vytvo�ena
		
			vrac� objekt
			.main = je hlavn� div	csn= csN (JBMenuItemSub / JBMenuItem)
			.ico = je div icony		csn= JBMenuItemIco
			.tx = span textu		csn= JBMenuItemTx   ob�lka spanu DI m� class JBMenuItemTxDiv
			.sp = div mezery		csn= JBMenuItemSp
			.img = pokud je zad�na ikona a existuje v poli, tak obsahuje element img v divu ico
			
			'div sub' existuje jen pokud se jedn� odkaz na podmenu a m� csn 'JBMenuItemSubPoint'
					tento div je p�id�n a� n�sledn� v rutine add
			
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
		//jen pomocn� pro n�sleduj�c� funkce
		//e je event my�i
		this.show(e.pageX,e.pageY);
	}
	this.show=function(x,y){
		/* zobraz� menu
			x=pozice z leva v pixelech relativn� od lev�ho horn�ho rohu str�nky
			y=pozice z vrchu pixelech relativn� od lev�ho horn�ho rohu str�nky
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
		//x= int v ms animace skryt�, jako v jQuery
		jQuery(v_menu).delay(100).hide(200);
	}
	this.add = function(p){
	/* funkce p�id� ��dek do menu
		p = parametry pro v�echny typy
			p.csN = pokud zad�no tak je ke classname DIV elementu JBMenuItem p�id�n tento text
			p.typ = - kdy� nezad�no tak norm�ln� ��dek odkaz/funkce
					- kdy� = 'split' tak bude vytvo�en ��dek odd�lova� s classname "JBMenuItemSplit"
					- kdy� = 'sub' tak bude vytvo�eno submenu s classname "JBMenuItemSub"
							v tomto ��dku je tak� vytvo�ena DIV s class 'JBMenuItemSubPoint' kde je zobrazena �ipka na submenu
			p.width = (integer) pokud nen� zad�no tak nen� pou�ito, jinak ���ka menu v px
					
			'p' parametry pro default typ
				p.tx = text ��dku
				p.url = pokud string tak URL, pokud objekt tak funkce a nen� br�n v potaz target 
				p.target = funkce jako u html linku
				p.ico = n�zev ikony z pole ikon p�i vytv��en� menu

			'p' parametry pro 'sub' typ
				p.tx = text ��dku
				p.wait = (integer) default 0, 0 okam�it� zobrazen� submenu, jinak �as zpo�d�n� zobrazen� v ms
				p.p = parametry pro submenu jako u funkce create
				p.ico = n�zev ikony z pole ikon p�i vytv��en� menu
				
			'p' parametry pro 'split' typ
				nem� parametry
			
		vrac� odkaz na vytvo�en� element
	*/
		var tx,url,target,x;
		var el=jQuery(v_menu);
		var itm;
		if(el.length<1)
			return false;
			
		//test parametr�
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
			//z�kladn� typ
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
					//jedn� se o link
					if(typeof this.JBlink=='undefined')
						this.JBlink=JB.x.a('','','','',{ob:this,csN:'JBMenuItemLink'});
					with(this.JBlink){
						href=p.url;
						target=p.target;
						click(event);
					}
				}else{
					//jedn� se funkci
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
			//vytvo� podmenu item
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

		//z�kladn� vlastnosti v�ech
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
		//nastav� title menu
		//pokud je tx null tak skryje title
		if(JB.is.empty(tx)){
			jQuery(v_title).hide();
		}else{
			jQuery(v_title).show();
			v_title.innerHTML=tx;
		}
	}
	this.clear=function(){
		//sma�e v�echny itemy z menu
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