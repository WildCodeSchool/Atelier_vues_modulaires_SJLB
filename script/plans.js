jQuery(document).ready(function(){
	
	/****************************
	 *		INITIALISATION		*
	 ****************************/
	// Initialisation des polys
	jQuery.ajax({
		type: "POST",
		async: false,
		url:urlBase+"ajax/poly-init.php",
		success: function(data, textStatus)
		{
			eval(data);
		},
		error: function (XMLHttpRequest, textStatus, errorThrown) 
		{
			//alert(XMLHttpRequest+'-'+textStatus+'-'+errorThrown); // the options for this ajax request
		}
	});
	
	// on masque tous les lieux
	jQuery('a[href=#tabs-3]').click(function(){		
		if (ongletActifOld=='lieux') razLieux();
		jQuery('ul#listePlans').children('li').children('label').nextAll('ul').hide();
		if (ongletActifOld=='rues') razRues();
		ongletActifOld = 'plans';
		razChk();
		zoomActiv = false;
	});
	
	/*
	// AFFICHER / MASQUER SPECIAL POUR LE PREMIER NIVEAU (ACCORDEON)
	jQuery('ul#listePlans').children('li').children('label').click(function(){

		if( jQuery(this).nextAll('ul').css('display') == 'none' )
		{
			jQuery('ul#listePlans').children('li').children('ul').hide('fast');
			jQuery(this).nextAll('ul').toggle('fast');
			jQuery('ul#listePlans img').attr('alt','haut');
			jQuery('ul#listePlans img').attr('src',url_carto_img+'haut.gif');
			jQuery(this).nextAll('img').attr('alt','bas');
			jQuery(this).nextAll('img').attr('src', url_carto_img+'bas.gif');

			if( getChkValue( jQuery(this).prev('div').attr('class') ) == 0 )
			{
				razChk();
				setDivChkValue(jQuery(this).prev('div'));
				updateChkEnfants(jQuery(this).prev('div'));
			}
		}
	});
	*/
	
	// Initialisation des checkbox (à 3 états)
	jQuery('ul#listePlans input:checkbox.categ').each(function(index){
		var self = jQuery(this);
		self.css('display','none');
		
		var id		= self.attr('id');
		var name	= id;
		var value	= self.val();
		
		self.wrap('<div class="myCheckbox0" id="'+id+'" name="'+name+'" value="'+value+'" />');
		
		// initialisation du nombre d'éléments cochés initialement --> modification de l'état de la checkbox parent en concéquence
		calculNbChkbox_plans( jQuery('div#'+id).next().next().next() );

		// on attache l'evenement click pour changer l'état de la coche
		self.parent('div#'+id).bind('click', function(){
			/* // comment Damien 15/12/2010
			var self2 = jQuery(this);

			// On ouvre le bloc sur le clic de la chkbox (si fermé)
			if( self2.nextAll('ul').css('display') == 'none')
				self2.next('label').click();
			else
			{	
				// on change la valeur du divChk
				setDivChkValue( self2 );
				
				// mise à jours des chk enfants
				updateChkEnfants( self2 );
			}
			*/
			
			// modif Damien 15/12/2010
			var self2 = jQuery(this);
			
			jQuery('path').each(function(){

				//jQuery(this).hide();
					
			})
			
			// si action sur le noeud prinicpale --> erase all
			if (self2.children('input').attr('class') == 'categ main' && getChkValue(self2.attr('class')) == '0'){
				razChk();
			}
						
			
			var chkValue = getChkValue( self2.attr('class') );
			var newChkValue = ( parseInt(chkValue) + 2 ) < 3 ? ( parseInt(chkValue) + 2 ) : 0;
			var laclass = 'myCheckbox'+newChkValue;

			if (newChkValue == 2){
				// nbplan récupere nbplanmax
				var nbplanmax = self2.next().children('span.nbPlansMax').html();
				self2.next().children('span.nbPlans').html(nbplanmax);
			}else{
				self2.next().children('span.nbPlans').html(0);
			}
			
			self2.attr('class',laclass);

			// mise Ã  jours des chk enfants
			updateChkEnfants( self2 );

			// On ouvre le bloc sur le clic de la chkbox (si fermé)
			if( self2.nextAll('ul').css('display') == 'none'){
				self2.next('label').click();
			}			

			calculNbChkbox_plans( self2.next().next().next() );
			// fin modif

			jQuery('ul').children('li.liplan').children('input').each(function(index){
				id_plans[index] = [jQuery(this).val()];
			});
			
			self2.nextAll('ul').children('li.liplan').children('input').each(function(index){
				id_selected = jQuery(this).val();
			});

			
			if (self2.children('input').attr('class') == 'categ main'){
			
				// ajouter un commentaire sur les plans	
				var i_temp = 0;
				jQuery('path').each(function(){
	
					var zIndex_temp = jQuery(this).attr("style");
					zIndex_temp = zIndex_temp.substr(zIndex_temp.indexOf(':'));
					zIndex_temp = zIndex_temp.substr(1,4);
	
					id_temp = eval(zIndex_temp.substr(1,4)-100);
					jQuery(this).attr('id','plan_'+id_temp);
	
					jQuery(this).attr('title',tableauPlans[id_temp].title);
					//jQuery(this).hide();
						
				})
			
			}

			jQuery('path#plan_'+id_selected).attr('title',tableauPlans[id_selected].title);
			jQuery('path#plan_'+id_selected).show();
						
		});
	});
	
	// init des markers lieux (plans) - (On doit les cacher)
	for(x in tableauMarqueurs)
	{
		jQuery('ul#listePlans #lieu_'+tableauMarqueurs[x].marqueurId).each(function(){
			tableauMarqueurs[x].setVisible(false);
		});
	}
	
	/************************
	 *		EVENEMENTS		*
	 ************************/
	// Checkbox plans
	jQuery('ul#listePlans input:checkbox.lieu').change(function(){
		var self = jQuery(this);
		id = self.val();
		
		/*if( getChkValue( self.parent('li').parent('ul').prevAll('div').attr('class') ) == 0 )
		{
			self.removeAttr('checked');
		}*/
		
		if(self.attr('checked') == true)
		{
			self.attr('title','Cliquez pour masquer le lieu');
			tableauMarqueurs[id].setVisible(true);
			if( self.parent().next('label').children('a').size() < 1 ) {
				var lien = '<a href="javascript:updateInfoWindow(\'<h2>'+tableauMarqueurs[id].marqueurNom.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'</h2>'+tableauMarqueurs[id].marqueurContenu.replace(/([\\'])/g, "&rsquo;").replace(/([\\"])/g, "&quot;")+'\', '+id+');" title="Cliquez pour identifier le lieu sur la carte">'+self.parent().next('label').html()+'</a>';
				self.parent().next('label').html(lien);
			}
		}
		else
		{
			self.attr('title','Cliquez pour afficher le lieu');
			tableauMarqueurs[id].setVisible(false);
			if( self.parent().next('label').children('a').size() == 1 )
			{
				self.parent().next('label').html( self.parent().next('label').children('a').html() ).children('a').remove();
			}
			infoWindow.close();
		}
		

		// modif Damien 15/12/2010
		// Calcul du nbre de chkbox cochÃ©
		calculNbChkbox_plans(self.parent().parent().parent());
		
	});
	
	jQuery('ul#listePlans input:checkbox.categ').change(function(){
		var self = jQuery(this);
		self.parent('div').nextAll('ul').children('li.liplan').children('input').each(function(index){
			id_plans[index] = [jQuery(this).val()];
		});
		
		if( self.checked == true)
		{
			for(x in id_plans)
			{
				setPlanVisible( tableauPlans[id_plans[x]], true);
			}
		}
		else
		{
			for(x in id_plans)
			{
				setPlanVisible( tableauPlans[id_plans[x]], false);
			}
		}
	});
	
});

/************************
 *		FONCTIONS 		*
 ************************/
 
function setDivChkValue(_oDivChk)
{
	var chkValue = getChkValue( _oDivChk.attr('class') );
	var newChkValue = ( parseInt(chkValue) + 1 ) < 3 ? ( parseInt(chkValue) + 1 ) : 0;
	var laclass = 'myCheckbox'+newChkValue;
	_oDivChk.attr('class',laclass);
}

function razLieux()
{
	/*jQuery('ul#listeLieux input:checkbox:checked').removeAttr('checked');
	jQuery('ul#listeLieux input:checkbox.categ').removeAttr('checked');
	jQuery('ul#listeLieux input:checkbox.categ').parent('div').attr('class',"myCheckbox0");
	jQuery('ul#listeLieux input:checkbox').change();*/
	jQuery('ul#listeLieux input:checkbox:checked').each(function(){
		jQuery(this).removeAttr('checked');
		memoireCheck[jQuery(this).attr('id')]="check";
	});
	jQuery('ul#listeLieux input:checkbox.categ').each(function(){
		memoireClass[jQuery(this).attr('id')]=jQuery(this).parent('div').attr('class');
		jQuery(this).parent('div').attr('class',"myCheckbox0")
	});
	jQuery('ul#listeLieux input:checkbox').change();
}

function razChk()
{
	jQuery('ul#listePlans input:checkbox.categ').each(function(){
		var self 	= jQuery(this);
		var id		= self.attr('id');
		
		// on met à 0 le nb de plan temporaire
		self.parent('div#'+id).next('label').children('span.nbPlans').html(0);
		
		self.parent('div#'+id).attr('class','myCheckbox0');	// on décoche la fausse checkbox
		
		// mise Ã  jours des chk enfants
		updateChkEnfants( self.parent('div#'+id) );
		
		self.parent('div#'+id).nextAll('ul').hide();
		
		if(jQuery(this).nextAll('img').attr('alt') == 'bas')
		{
			jQuery(this).nextAll('img').attr('alt','haut');
			jQuery(this).nextAll('img').attr('src',url_carto_img+'haut.gif');
		}
		else
		{
			jQuery(this).nextAll('img').attr('alt','bas');
			jQuery(this).nextAll('img').attr('src', url_carto_img+'bas.gif');
		}
		
		/*
		self.parent('div#'+id).nextAll('ul').children('li').children('input:checkbox').removeAttr('checked'); // on décoche toutes les checkbox lieux
		self.change();
		self.parent('div#'+id).nextAll('ul').children('li').children('input:checkbox').change();
		*/
	});
}

//modif Damien 15/12/2010
//calculNbChkbox(_EltChkbox)
//_EltChkbox : <ul>
function calculNbChkbox_plans(_EltChkbox)
{
		
	var nbLieu = _EltChkbox.find('input:checkbox:checked').size();
	_EltChkbox.prev().prev().children('span.nbLieu').html(nbLieu);
	
	// somme des lieu + plan associé au ul (_EltChkbox)
	var nb_elem = eval(_EltChkbox.prev().prev().children('span.nbLieu').html())+eval(_EltChkbox.prev().prev().children('span.nbPlans').html());

	switch(nb_elem){
		case 0:
				var laclass = 'myCheckbox0';
			break;
		case eval(_EltChkbox.prev().prev().children('span.nbLieuMax').html()):
				var laclass = 'myCheckbox2';
			break;
		default:
				var laclass = 'myCheckbox1';
			break;
	}
	var self_div = _EltChkbox.prev().prev().prev();

	self_div.attr('class',laclass);

	if (_EltChkbox.parent().parent().prev().prev().children('span').hasClass('nbLieu')) { calculNbChkbox_plans(_EltChkbox.parent().parent()) }
}
//fin modif Damien 15/12/2010

function createPoly(_id, _LibellePlan, _LibelleCategorie, _TypePlan, _BordureCouleur, _BordureEpaisseur, _IdCategorie, _CoordonneesPlan, _show, _BordureOpacite, _Opacite)
{
	if( _CoordonneesPlan != '' )
	{
		var opacity = 0;
		var fillopacity = 0;
		var strokeopacity = 0;
		if(_show == 'show')
		{
			var opacity = 1;
			var fillopacity = _Opacite;
			var strokeopacity = _BordureOpacite;
		}
		
		var tabCoords = _CoordonneesPlan.split(';');
		var sep = '';
		var strCoords = '';
		for(i in tabCoords)
		{
       		strCoords += sep+'new google.maps.LatLng'+tabCoords[i]+'';
       		sep = ',';
       	}
		var coords = eval('['+strCoords+']');
		var zIndex_temp = eval(100 + _id);
		
		if( _TypePlan == 'P' )
		{			
			tableauPlans[_id] = 
			new google.maps.Polygon({
				'clickable':false,
				'fillColor':_BordureCouleur,
				'fillOpacity':parseFloat(fillopacity),
				'geodesic':false,
				'map':map,
				'paths':coords,
				'strokeColor':_BordureCouleur,
				'strokeOpacity':parseFloat(strokeopacity),
				'strokeWeight':_BordureEpaisseur,
				'zIndex':zIndex_temp
			});
		}
		else
		{
			tableauPlans[_id] = 
			new google.maps.Polyline({
				'clickable':false,
				'geodesic':false,
				'map':map,
				'path':coords,
				'strokeColor':_BordureCouleur,
				'strokeOpacity':parseFloat(strokeopacity),
				'strokeWeight':_BordureEpaisseur,
				'zIndex':zIndex_temp
			});
		}
		tableauPlans[_id].title = _LibellePlan;
		tableauPlans[_id].opacite = _Opacite;
		tableauPlans[_id].opaciteB = _BordureOpacite;
	}
	else
	{
		var type=(_TypePlan == 'P') ? 'plan' : 'traçé';
		alert('Erreur de paramétrage du '+type+' '+_LibellePlan+' !!!');
	}
	
		
}

function setPlanVisible(_objPlan, _affiche)
{
	if(_affiche)
	{
		if( !isNaN(_objPlan.fillOpacity) )
			_objPlan.setOptions( {'fillOpacity':parseFloat(_objPlan.opacite)} );
		_objPlan.setOptions( {'strokeOpacity':parseFloat(_objPlan.opaciteB)} );
	}
	else
	{
		if( !isNaN(_objPlan.fillOpacity) )
			_objPlan.setOptions( {'fillOpacity':0} );
		_objPlan.setOptions( {'strokeOpacity':0} );
	}
	/*
	if (initialisation_polygon == 1){
		_objPlan.setOptions( {'zIndex':100} );
	}
	*/
	
}