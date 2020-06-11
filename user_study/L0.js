// for caching past queries
var L0SETS = {};

function intersect_pair(setA, setB) {
    return new Set([...setA].filter(x => setB.has(x)));
}

// set intersection
function intersect(list_of_set) {
    if (list_of_set.length == 0) {
        return [];
    };
    if (list_of_set.length == 1){
        return list_of_set[0];
    } else {
        return list_of_set.reduce(intersect_pair);
    }
}

function L0(exs){
    // console.log(exs);
    var to_intersect = [];
    Object.entries(exs).forEach(([key, value]) => {
        var exx = value[0] == 2 ? "2" : `(${value[0]}, ${value[1]})`;
        // console.log(key);
        var to_qry = `((${key[0]}, ${key[2]}), ${exx})`;
        // console.log(l0vs[to_qry]);
        if (L0SETS[to_qry] == undefined) {
            L0SETS[to_qry] = new Set(l0vs[to_qry]);
        };
        to_intersect.push(L0SETS[to_qry]);
        //to_intersect.push(l0vs[to_qry]);
    });
    return intersect(to_intersect);
}
