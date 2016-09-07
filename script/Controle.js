function SaisieObligatoire(Cible)
{	
	if (Cible.value == "" || Cible.value == null)
	{
		alert("La saisie du champ est obligatoire");
		Cible.focus();
		return false;
	}
	else
	{
		return true;
	}
}

function Verification(Cible,Comparaison)
{
	if (Cible.length != 0)	
	{
		for (var i = 0; i < Cible.length; i++)
		{
			for (var j = 0; j < Comparaison.length; j++)
			{
				if (Cible.charAt(i) == Comparaison.charAt(j))
				{ 
					return false;
					break;
				}
			}
		}
		return true;
	}
	else
	{
		return false;
	}	
}

function Fraction(Cible,Motif)
{
	i = 0 ;
	aux = Cible ;
	resultat = new Array(0);
	resultat[1]="";
	resultat[2]="";
	resultat[3]="";
	resultat[4]="";
	resultat[5]="";
	while (aux.indexOf(Motif,0) > 0)
	{
	resultat[i] = aux.substring(0, aux.indexOf(Motif,0));
	aux = aux.substring(aux.indexOf(Motif,0)+1,aux.length);
	i ++ ;
	}
	resultat[i] = aux;
	
	return resultat;
}


function ControlePhone(Cible,Separateur,Pays)
{
	if (Cible.value != "")
	{
		if (typeof(Separateur) =="undefined")
		{
			Separateur='/';
		}
		if (typeof(Pays) =="undefined")
		{
			Pays='Fr';
		}
		if ((Cible.value.charAt(2) == Separateur) && (Cible.value.charAt(5) == Separateur)
		&& (Cible.value.charAt(8) == Separateur) && (Cible.value.charAt(11) == Separateur)
		&& (Cible.value.length == 14))
		{
			resultat = Fraction(Cible.value,Separateur);
	
			var erreur = 0;
			if ((Cible.value.length != 14) && (Pays == 'Fr'))
			{
				erreur = 1;
			}

			for (i in resultat)
    	{
				if ((resultat[i] > 99) || (resultat[i] < 0 || (VerificationNum(resultat[i],Entier()) == false && resultat[i]!='')))
				{
					erreur = 1;
				}
			}

			if (erreur == 1)
			{
				alert('Le format de téléphone ou fax est incorrect');
				Cible.focus();
				return false;
			}
			else
			{
				return true;
			}
		}
		else
		{
			alert('Le format de téléphone ou fax est incorrect');
			Cible.focus();
			return false;
		}
	}
	else
	{
		return true;
	}
}

function ControleDate(Cible,Separateur,Type)
{
	
	if (typeof(Separateur) =="undefined")
	{
		Separateur='/';
	}
	
	resultat = Fraction(Cible.value,Separateur);

	if (typeof(Type) =="undefined")
	{
		Type="JMA";
	}	
	
	if (Type == "AMJ")
	{
		a = resultat[2];
		b = resultat[1];
		c = resultat[0];
	}
	if (Type == "JMA")
	{
		a = resultat[0];
		b = resultat[1];
		c = resultat[2];
	}
	if (Type == "MJA")
	{
		a = resultat[1];
		b = resultat[0];
		c = resultat[2];
	}
		
	var erreur = 0;

	if (Cible.value.length<10){
		erreur = 5;
	}
	
	if (VerificationNum(a,Entier()) == false || VerificationNum(b,Entier()) == false ||
	 VerificationNum(c,Entier()) == false )
	{
		erreur = 1;
	}

	if (a < 1 || a > 31 || b < 1 || b > 12 || c < 0 || c > 9999)
	{
		erreur = 2;
	}

	if ((a == 31) && (b == 4 || b == 6 || b == 9 || b == 11))
	{
		erreur = 3;
	}
	
	if (b == 2 && (( a > 29 && (c % 4 == 0)) || ( a > 28 && (c % 4 != 0)))) 
	{
		erreur = 4;
	}

	if (erreur == 1)
	{
		alert('Le format de la date est incorrect');
		Cible.focus();
		return false;
	}
	else if (erreur == 2)
	{
		alert('Le format de la date est incorrect');
		Cible.focus();
		return false;
	}
	else if (erreur == 3)
	{
		alert('La date saisie est incorrect');
		Cible.focus();
		return false;
	}
	else if (erreur == 4)
	{
		alert('La date saisie est incorrect');
		Cible.focus();
		return false;
	}
	else if (erreur == 5)
	{
		alert('Le format de date attendu est jj/mm/aaaa');
		Cible.focus();
		return false;
	}
	else
	{
		return true;
	}


}

function ControleEmail(Cible)
{
	if (Cible.value != "")
	{
		if (Cible.value.indexOf('@',0) < 0)
		{
			alert('L\'adresse email n\'est pas valide');
			Cible.focus();
			return false;
		}
		else
		{
			resultat = Fraction(Cible.value,'@');
			if (VerificationMail(resultat[0]) == false ||  
			resultat[0] == "" || VerificationMail(resultat[1]) == false 									
			|| resultat[1] == "")
			{
				alert('L\'adresse email n\'est pas valide');
				Cible.focus();
				return false;
			}
			else
			{
				return true;
			}
		}
	}
	else
	{
		return true;
	}
}

function Entier()
{
	return "0123456789";
}

function DecimalPoint()
{
	return "0123456789.-";
}

function DecimalVirgule()
{
	return "0123456789,";
}

function AlphaNumerique()
{
	chaine="abcdefghijklmnopqrstuvwxyz";
	chaine=chaine + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	chaine=chaine + " àâäÂÄéèêëÊËîïÎÏôöÔÖùûüÛÜç";
	chaine=chaine + "0123456789";
	return chaine;
}

function AlphaNumeriqueMail()
{
	chaine="abcdefghijklmnopqrstuvwxyz";
	chaine=chaine + "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	chaine=chaine + "0123456789";
	chaine=chaine + "._-";
	return chaine;
}

function ControleNumerique(Cible,Type)
{
	if (Cible.value != "")
	{
		Valeur="";
		Message="";
		
		if(typeof(Type)=="undefined")
		{
			Type="Entier";
		}
		if (Type == "Entier")
		{
			Valeur=Entier();
			Message="Le format de nombre attendu est un entier";
		}
		if (Type == "DecimalVirgule")
		{
			Valeur=DecimalVirgule();
			Message="Le format de nombre attendu est un décimal à virgule";
		}
		if (Type == "DecimalPoint")
		{
			Valeur=DecimalPoint();
			Message="Le format de nombre attendu est un décimal à point";	
		}

		if (VerificationNum(Cible.value,Valeur) == false)
		{
			alert(Message);
			Cible.focus();
			return false;
		}
		else
		{
			return true;
		}
	}
	else
	{
		return true;
	}
}

function VerificationNum(Cible,Comparaison)
{
	var ok=true;
	if (Cible.length != 0){
		for (var i = 0; i < Cible.length; i++){
			for (var j = 0; j < Comparaison.length; j++){
				if (Cible.charAt(i) != Comparaison.charAt(j))
					ok=false;
				else{
					ok=true;
					break;
				}
					
			}
			if (ok==false){
				break;
			}
		}
		return ok;
	}
	else
	{
		return false;
	}	
}

function VerificationAlphanumerique(a)
{
	var ok=true;
	Comparaison=AlphaNumerique();
	Cible=a.value;
	if (Cible.length != 0){
		for (var i = 0; i < Cible.length; i++){
			for (var j = 0; j < Comparaison.length; j++){
				if (Cible.charAt(i) != Comparaison.charAt(j)){
					car=Cible.charAt(i);
					ok=false;
				}
				else{
					ok=true;
					break;
				}
					
			}
			if (ok==false){
				alert("Le caractère " + car + " n'est pas autorisé ici");
				a.focus;
				break;
			}
		}
		return ok;
	}
	else
	{
		return false;
	}	
}

function VerificationMail(a)
{
	var ok=true;
	Comparaison=AlphaNumeriqueMail();
	Cible=a;
	if (Cible.length != 0){
		for (var i = 0; i < Cible.length; i++){
			for (var j = 0; j < Comparaison.length; j++){
				if (Cible.charAt(i) != Comparaison.charAt(j)){
					car=Cible.charAt(i);
					ok=false;
				}
				else{
					ok=true;
					break;
				}
			}
			if (ok==false){
				alert("Le caractère " + car + " n'est pas autorisé ici");
				break;
			}
		}
		return ok;
	}
	else
	{
		return false;
	}	
}

function verifMail(a)
{
testm = false ;
 for (var j=1 ; j<(a.length) ; j++) {
  if (a.charAt(j)=='@') {
   if (j<(a.length-4)){
    for (var k=j ; k<(a.length-2) ; k++) {
     if (a.charAt(k)=='.') testm = true;
    }
   }
  }
 }
if (testm==false) alert('L\'adresse email n\'est pas valide');
return testm ;
}

function CheckLen(Target) 
		{
		StrLen = Target.value.length
		if (StrLen > 250 ) 
			{
			Target.value = Target.value.substring(0,250);
			}
		
		}
