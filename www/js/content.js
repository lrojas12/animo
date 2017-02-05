console.log("Hello world");

chrome.runtime.onMessage.addListener(
    function(req, sender, sendResponse){
    	if(req.message == "clicked_browser_action"){
    	    //grab the first url
    	    var firstHref = $("a[href^='http']").eq(0).attr("href");
    	    console.log(firstHref);

    	    chrome.runtime.sendMessage({"message": "open_new_tab", "url":firstHref});
    	}
    }
);
