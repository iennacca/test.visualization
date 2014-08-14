/**
 * Created by jchaves on 8/11/14.
 */

import CDO = require('./infrastructure');

export class FakeDataDisplay implements CDO.AsyncDataDisplay {
    DisplayDataAsync(data: CDO.CDODataSet[]): JQueryPromise<CDO.CDODataSet[]> {
        var d = $.Deferred();

        setTimeout(function () {
            for (var i: number = 0; i < data.length; i++) {
                $('#data').append('<li> ' + data[i].Name + ' </li>');
                console.log(data[i].Name);
            }
            d.resolve(data);
        }, 2000);
        return d.promise();
    }
}
