//data to use in tests
var data = {

    //nested sample
    gadgets:[
        { 
            name:"iPhone", 
            features:
            {
                touch:true,
                appStore:true,
                service3g:true,
                service4g:false
            }
        },
        { 
            name:"EVO4G", 
            features:
            {
             touch:true,
                appStore:true,
                service3g:true,
                service4g:true
            }
        },
        { 
            name:"BlackBerry", 
            features:
            {
                touch:false,
                appStore:false,
                service3g:true,
                service4g:false
            }
        },
        { 
            name:"TracPhone", 
            features:
            {
                touch:false,
                appStore:false,
                service3g:false,
                service4g:false
            }
        }
    ]
}


var relations = [
    { pattern: "web site", parent: "Website" },
    { pattern: "website", parent: "Website" },
    { pattern: "social media( campaign)?", parent: "Social Media Campaign" },
    { pattern: "web design", parent: "Web Design" },
    { pattern: "((content )?marketing )?strategy", parent: "Content Marketing Strategy" },
    { pattern: "strategy", parent: "Strategy" },
    { pattern: "e[\- ]?commerce", parent: "ECommerce" },
    { pattern: "user experience", parent: "User Experience" },
    { pattern: "user interface", parent: "User Interface" },
    { pattern: "project manage(r|ment)", parent: "Project Management" },
    { pattern: "product manage(r|ment)", parent: "Product Management" },
    { pattern: "(re(-)?)?design(er)?", parent: "Design" },
    { pattern: "((teaser|web) )?video(s)?", parent: "Teaser Video" },
    { pattern: "\\bapp\\b", parent: "App" },
    { pattern: "\\bios\\b", parent: "iOS" },
    { pattern: "android", parent: "Android" },
    { pattern: "mobile", parent "Mobile" },
    { pattern: "seo/sem", parent: "SEO/SEM" },
    { pattern: "\\bseo\\b", parent "SEO/SEM" },
    { pattern: "\\bsem\\b", parent "SEO/SEM" },
    { pattern: "brand(ing)?", parent: "Branding" },
    { pattern: "ux/ui", parent: "UI/UX" },
    { pattern: "ui/ux", parent: "UI/UX" },
    { pattern: "\\bux\\b", parent: "UI/UX" },
    { pattern: "\\bui\\b", parent: "UI/UX" }
]