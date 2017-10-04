var items = ["", "", "", "", "", ""];
var names = ["", "", "", "", "", ""];
var rabadon_flag = false;
var link = "http://127.0.0.1:5000";

MathUtils = {
    roundToPrecision: function(subject, precision) {
        return +((+subject).toFixed(precision));
    }
};

/*
                Due to asynchronous programming, the loop has to be written like this so that the function returns a function.
                If not, then i for "#item" + i will always be 3 because it looks at the top level, which is where the for loop
                ends at i = 3.
*/
function sad(i) {
                return function () {
                    var selected = $(this).text();
                    if(selected.indexOf("Rabadon") != -1)
                        rabadon_flag = true;
                    else
                        rabadon_flag = false;

                    var title = '#item' + i.toString();
                    var name = '#name' + i.toString();
                    //console.log(title)
                    //console.log($(title))
                    if(selected == "None")
                    {
                        items[i - 1] = "";
                    }
                    else
                    {
                        items[i - 1] = httpGet("/itemInfo/" + selected);
                    }
                    names[i - 1] = selected;
                    $(title)[0].src = "/static/items/" + selected.replace(/ /g,"_") + ".png";
                    $(name).text(selected);
                }
}
 
function total_stats() {
    //alert(items);
    var dict = {"FlatMPPoolMod":0,"FlatArmorMod":0,"FlatMagicDamageMod":0,"FlatSpellBlockMod":0,"FlatPhysicalDamageMod":0,"FlatHPPoolMod":0,"FlatMovementSpeedMod":0,"PercentAttackSpeedMod":0,"FlatCritChanceMod":0,"PercentLifeStealMod":0,"CoolDownReduction":0};
    for(var i = 0; i < 6; i++)
    {
        if(items[i] != "")
        {
            //console.log(i + " " + items[i]);
            var j = JSON.parse(items[i]);
            for(var key in j)
            {
                if(j.hasOwnProperty(key))
                {
                    if(key in dict)
                    {
                        dict[key] = MathUtils.roundToPrecision(dict[key] + parseFloat(j[key]), 1);
                    }
                    else
                    {
                        dict[key] = parseFloat(j[key]);
                    }
                }
            }
        }
    }

    //rabadon check
    if(rabadon_flag)
    {
        dict["FlatMagicDamageMod"] *= 1.35;
    }

    for(key in dict)
    {
        //console.log(key + ": " + dict[key]);
        switch(key)
        {
            case "FlatHPPoolMod":
                $("#hp").text(dict[key]);
                break;
            case "FlatMPPoolMod":
                $("#mp").text(dict[key]);
                break;
            case "FlatArmorMod":
                $("#armor").text(dict[key]);
                break;
            case "FlatSpellBlockMod":
                $("#mr").text(dict[key]);
                break;
            case "FlatPhysicalDamageMod":
                $("#ad").text(dict[key]);
                break;
            case "FlatMagicDamageMod":
                $("#ap").text(dict[key]);
                break;
            case "FlatMovementSpeedMod":
                $("#speed").text(dict[key]);
                break;
            case "PercentAttackSpeedMod":
                $("#as").text(dict[key] * 100 + "%");
                break;
            case "FlatCritChanceMod":
                if(dict[key] >= 1)
                    $("#crit").text("100%");
                else
                    $("#crit").text(dict[key] * 100 + "%");
                break;
            case "PercentLifeStealMod":
                $("#life").text(dict[key] * 100 + "%");
                break;
            case "CoolDownReduction":
                if(dict[key] > 45)
                    $("#cdr").text("45%");
                else    
                    $("#cdr").text(dict[key] + "%");
                break;
        }
    }
}

function httpGet(theUrl)
{
    //taken from SO
    if (window.XMLHttpRequest)
    {// code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp=new XMLHttpRequest();
    }
    else
    {// code for IE6, IE5
        xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
    }
    xmlhttp.open("GET", theUrl, false );
    xmlhttp.send();    
    return xmlhttp.responseText;
}

function create_url()
{
    var share = link + "?param=" + names.toString().replace(/ /g,"_");
    //alert(share);
    document.getElementById('link').value = share;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

$( document ).ready(function() {
            for(var i = 1; i < 7; i++)
            {
                $('#drop' + i.toString() + ' li a').on('click', sad(i));
            }
            link = window.location.hostname;
            var btn_submit = document.getElementById('submit');
            btn_submit.onclick = total_stats;
            var btn_share = document.getElementById('share');
            btn_share.onclick = create_url;
            var u = window.location.href;
            var parameters = getParameterByName('param', u);
            if(parameters != null)
            {
                var premade = parameters.split(',');
                //console.log(premade);
                for(var i = 0; i < premade.length; i++)
                {
                    if(premade[i] != "")
                    {
                        if(premade[i].indexOf("Rabadon") != -1)
                        {
                            rabadon_flag = true;
                        }
                        else
                            rabadon_flag = false;

                        var title = '#item' + (i + 1).toString();
                        var name = '#name' + (i + 1).toString();

                        if(premade[i] != "" && premade[i] != "None")
                        {
                            items[i] = httpGet("/itemInfo/" + premade[i].replace(/_/g, "%20"));
                        }
                        names[i] = premade[i].replace("_", " ");
                        $(title)[0].src = "/static/items/" + premade[i] + ".png";
                        $(name).text(premade[i].replace("_", " "));
                    }
                }
            }

            total_stats();            
});
