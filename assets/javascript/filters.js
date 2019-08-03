profileFilters = [
    // filters take the mostly processed data we use to make profiles as input
    function(p) {
        
    },
    
    // Content filters
    function(p) { // age filter
        return !(p.stats && p.stats.age && p.stats.age < 16);
    },
    function(p) { 
        return !p.raw.includes('incest');
    }
]