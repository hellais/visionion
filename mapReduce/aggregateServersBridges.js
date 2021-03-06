﻿//	MAP  /////////////////////////////////////////////////////////////////////////////////////////////////////
var mapServersBridges = function(theDate) {
  return function() {
    var self = this,
      map = {
        date: self.date ,
        servers : {
          total : {
            count : 1 ,
            bwa : self.bwa ,
            bwc : self.bwc ,
            osv : {
              linux : (self.osv == "linux") ? 1 : 0 ,
              darwin : (self.osv == "darwin") ? 1 : 0 ,
              freebsd : (self.osv == "freebsd") ? 1 : 0 ,
              windows : (self.osv == "windows") ? 1 : 0 ,
              other : (self.osv == "other") ? 1 : 0
            } ,
            tsv : {
              v010 : (self.tsv == "010") ? 1 : 0 ,
              v011 : (self.tsv == "011") ? 1 : 0 ,
              v012 : (self.tsv == "012") ? 1 : 0 ,
              v020 : (self.tsv == "020") ? 1 : 0 ,
              v021 : (self.tsv == "021") ? 1 : 0 ,
              v022 : (self.tsv == "022") ? 1 : 0 ,
              v023 : (self.tsv == "023") ? 1 : 0 ,
              v024 : (self.tsv == "024") ? 1 : 0
            }
          }
        }
      };
    emit( theDate + " ServersBridges" , map );
  } 
};

//	REDUCE  //////////////////////////////////////////////////////////////////////////////////////////////////
var reduceServersBridges = function ( key, values ) {	
	var temp = {
		date : 0 ,
		servers : {
			total : {
				count : 0 ,
				bwa : 0 ,
				bwc : 0 ,
				osv : {
					linux : 0 ,
					darwin : 0 ,
					freebsd : 0 ,
					windows : 0 ,
					other : 0
				} ,
				tsv : {
					v010 : 0 ,
					v011 : 0 ,
					v012 : 0 ,
					v020 : 0 ,
					v021 : 0 ,
					v022 : 0 ,
					v023 : 0 ,
					v024 : 0
				}
			}
		}
	};
	values.forEach( function(v) {
		temp.date = v.date ;
		temp.servers.total.count += 1 ;
		temp.servers.total.bwa += v.servers.total.bwa ;
		temp.servers.total.bwc += v.servers.total.bwc ;
		temp.servers.total.osv.linux += v.servers.total.osv.linux ;
		temp.servers.total.osv.darwin += v.servers.total.osv.darwin ;
		temp.servers.total.osv.freebsd += v.servers.total.osv.freebsd ;
		temp.servers.total.osv.windows += v.servers.total.osv.windows ;
		temp.servers.total.osv.other += v.servers.total.osv.other ;
		temp.servers.total.tsv.v010 += v.servers.total.tsv.v010 ;
		temp.servers.total.tsv.v011 += v.servers.total.tsv.v011 ;
		temp.servers.total.tsv.v012 += v.servers.total.tsv.v012 ;
		temp.servers.total.tsv.v020 += v.servers.total.tsv.v020 ;
		temp.servers.total.tsv.v021 += v.servers.total.tsv.v021 ;
		temp.servers.total.tsv.v022 += v.servers.total.tsv.v022 ;
		temp.servers.total.tsv.v023 += v.servers.total.tsv.v023 ;
		temp.servers.total.tsv.v024 += v.servers.total.tsv.v024 ;
	});
	return temp;
};

//	BINDING MAP AND REDUCE  //////////////////////////////////////////////////////////////////////////////////
var aggregateServersBridges = function(theDate) {
  // http://docs.mongodb.org/manual/reference/method/db.collection.mapReduce/#db.collection.mapReduce
	db.importBridges.mapReduce (			
		mapServersBridges(theDate),
		reduceServersBridges,
		{ 
			out: { 
				reduce : "tempFacts" 					//	the temporary fact collection
			//	, nonAtomic : true						//	prevents locking of the db during post-processing
			} ,			
			query : { "date" : theDate } 				//	limit aggregation to date
			//	, sort									//  sorts the input documents for fewer reduce operations
			//	, jsMode: true							//	check if feasable! is faster, but needs more memory
			//	, finalize : finalizeFacts
		}
	);
};

//	EXECUTION  ///////////////////////////////////////////////////////////////////////////////////////////////
var date = "2013-04-03 22" ;
var run = function(date) {
	aggregateServersBridges(date);
};
run(date);
