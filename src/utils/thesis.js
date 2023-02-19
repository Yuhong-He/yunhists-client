export function handleThesisIssue(thesisIssue) {
    let str = "";
    if(thesisIssue.year !== "") {
        str += thesisIssue.year;
    }
    if(thesisIssue.volume !== "") {
        str += ",";
        str += thesisIssue.volume;
    }
    if(thesisIssue.issue !== "") {
        str += "(";
        str += thesisIssue.issue;
        str += ")";
    }
    return str;
}