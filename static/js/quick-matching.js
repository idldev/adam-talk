/*
* http://www.keithratliff.com/blog/post/bad-words-filtering-through-regular-expressions.aspx
*/

function keywords(word) {
	var filters = [
		"web site",
		"social media campaign",
		"website"
	]

	var re = new RegExp(filters.join("|"), "ig");
    return(word.match( re ) != null);
}