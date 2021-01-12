const express = require('express')
const router = express.Router()
const xl = require('excel4node')
// const mysql = require('mysql')

// const connection = mysql.createConnection({
//   host: process.env.RB_HOST,
//   user: process.env.RB_USER,
//   password: process.env.RB_PW,
//   database: process.env.RB_DB,
//   multipleStatements: true //MUST HAVE to make more than 1 sql statement in a single query
// })

module.exports = {

  save2xlsx: router.post('/save2xlsx', (req, res, next) => {

    //begin date difference calculator////////////////////////////////////////////////////
    Date.dateDiff = function (datepart, fromdate, todate) {
      datepart = datepart.toLowerCase();
      var diff = todate - fromdate;
      var divideBy = {
        w: 604800000, //ms in one week
        d: 86400000, //ms in one day
        h: 3600000, //ms in one hour
        m: 60000, //ms in one minute
        s: 1000 //ms in one second
      };

      return Math.floor(diff / divideBy[datepart]);
    }
    //end date difference calculator////////////////////////////////////////////////////

    //NOTE++++++++>>> searchResXlsx is the original array that holds the collection of searchResXlsx objects {columnName: cellValue}
    //HOWEVER, since the inherent order (from showsearchResXlsx()) of these key:value pairs is not NECESSARILY the order we want to display them
    //in the excel file, and also since there MAY BE additional key:value pairs from searchResXlsx that we DON'T want to display (i.e. P_K)
    //we selectively reorder and/or remove the key:value pairs from searchResXlsx to form the searchResXlsx_selectiveReordering array
    //(WITHOUT modifying the original searchResXlsx array).

    var searchResXlsx_selectiveReordering = []

    for (let a = 0; a < searchResXlsx.length; a++) {
      let reorderedResObj = {}
      // reorderedResObj['P_K'] = searchResXlsx[a]['P_K']
      reorderedResObj['Vendor'] = searchResXlsx[a]['Vendor']
      reorderedResObj['EDI'] = searchResXlsx[a]['EDI']
      reorderedResObj['IssDt'] = searchResXlsx[a]['IssDt']
      reorderedResObj['last_rtl_updt'] = searchResXlsx[a]['last_rtl_updt']
      reorderedResObj['Cmnts1'] = searchResXlsx[a]['Cmnts1']
      // reorderedResObj['Cmnts2'] = searchResXlsx[a]['Cmnts2']
      // reorderedResObj['Cmnts3'] = searchResXlsx[a]['Cmnts3']
      // reorderedResObj['Andr'] = searchResXlsx[a]['Andr']
      // reorderedResObj['Nathan'] = searchResXlsx[a]['Nathan']
      reorderedResObj['vndemail'] = searchResXlsx[a]['vndemail']
      reorderedResObj['wellMarg'] = searchResXlsx[a]['wellMarg']
      reorderedResObj['ongDisco'] = searchResXlsx[a]['ongDisco']
      // reorderedResObj['EA_Num_divide'] = searchResXlsx[a]['EA_Num_divide']
      // reorderedResObj['CS_Num_divide'] = searchResXlsx[a]['CS_Num_divide']
      reorderedResObj['special1'] = searchResXlsx[a]['special1']
      reorderedResObj['disco_appld_to'] = searchResXlsx[a]['disco_appld_to']
      reorderedResObj['sales_method'] = searchResXlsx[a]['sales_method']
      // reorderedResObj['min_order'] = searchResXlsx[a]['min_order']
      // reorderedResObj['edlp'] = searchResXlsx[a]['edlp']
      // reorderedResObj['order_qty'] = searchResXlsx[a]['order_qty']
      // reorderedResObj['rtlRvw'] = searchResXlsx[a]['rtlRvw']
      // reorderedResObj['wsImw'] = searchResXlsx[a]['wsImw']
      // reorderedResObj['rtlImw'] = searchResXlsx[a]['rtlImw']
      reorderedResObj['tot_updtd_rtl'] = searchResXlsx[a]['tot_updtd_rtl']

      searchResXlsx_selectiveReordering.push(reorderedResObj)
    }

    console.log(`JSON.stringify(searchResXlsx_selectiveReordering[0])==> ${JSON.stringify(searchResXlsx_selectiveReordering[0])}`)


    // Create a new instance of a Workbook class
    var wb = new xl.Workbook()

    // Add Worksheets to the workbook
    var ws = wb.addWorksheet('Sheet 1')

    var bodyStyle = wb.createStyle({
      alignment: {
        wrapText: false,
        horizontal: 'center',
      },
      font: {
        color: 'black',
        size: 12,
      },
      // numberFormat: '$#,##0.00; ($#,##0.00); -',
    })

    var headerStyle = wb.createStyle({
      alignment: {
        wrapText: false,
        horizontal: 'center',
      },
      font: {
        color: 'black',
        size: 14,
        bold: true,

      },
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'bright green' // HTML style hex value. defaults to black.
      },
    })

    var issDateHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'orange' // HTML style hex value. defaults to black.
      },
    })

    var wsUpdatedHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '#00aaaa' // HTML style hex value. defaults to black.
      },
    })

    var rtlUpdatedHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: '00ffcc' // HTML style hex value. defaults to black.
      },
    })

    var notInEdiHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'ffb3ca' // HTML style hex value. defaults to black.
      },
    })

    var requestedCatHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'ccd9ff' // HTML style hex value. defaults to black.
      },
    })

    var toDoHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'ff0000' // HTML style hex value. defaults to black.
      },
    })

    var sentRetailReviewHilite = wb.createStyle({
      fill: { // §18.8.20 fill (Fill)
        type: 'pattern', // Currently only 'pattern' is implemented. Non-implemented option is 'gradient'
        patternType: 'solid', //solid=t0d //§18.18.55 ST_PatternType (Pattern Type)
        bgColor: 'black', // HTML style hex value. defaults to black
        fgColor: 'ffab00' // HTML style hex value. defaults to black.
      },
    })

    for (let i = 0; i < Object.keys(searchResXlsx_selectiveReordering[0]).length; i++) {

      ws.cell(1, i + 1) //this targets "header" cells
        .string(`${Object.keys(searchResXlsx_selectiveReordering[0])[i]}`)
        .style(headerStyle)

      for (let j = 0; j < searchResXlsx_selectiveReordering.length; j++) {

        ws.cell(j + 2, i + 1)
          .string(`${Object.values(searchResXlsx_selectiveReordering[j])[i]}`)
          .style(bodyStyle)
        if (Object.keys(searchResXlsx_selectiveReordering[0])[i] == 'IssDt') {
          let cellDate1 = new Date(Object.values(searchResXlsx_selectiveReordering[j])[i])
          let currentDate1 = new Date()
          if (Date.dateDiff('w', cellDate1, currentDate1) > 24) //if issue date of cat is more than 6 months old
            ws.cell(j + 2, i + 1).style(issDateHilite)
        }
        if (Object.keys(searchResXlsx_selectiveReordering[0])[i] == 'last_rtl_updt') {
          if (Object.values(searchResXlsx_selectiveReordering[j])[i] !== null) {
            let cellDate2 = new Date(Object.values(searchResXlsx_selectiveReordering[j])[i])
            let currentDate2 = new Date()
            if (Date.dateDiff('w', cellDate2, currentDate2) > 24) //if issue date of cat is more than 6 months old
              ws.cell(j + 2, i + 1).style(issDateHilite)
          }
        }
        if (Object.values(searchResXlsx_selectiveReordering[j])[i] !== null) {
          if (Object.values(searchResXlsx_selectiveReordering[j])[i].toLowerCase().includes('wholesale updated')) {
            ws.cell(j + 2, i + 1).style(wsUpdatedHilite)
          }
          if (Object.values(searchResXlsx_selectiveReordering[j])[i].toLowerCase().includes('retail updated')) {
            ws.cell(j + 2, i + 1).style(rtlUpdatedHilite)
          }
          if (Object.values(searchResXlsx_selectiveReordering[j])[i].toLowerCase().includes('not in edi')) {
            ws.cell(j + 2, i + 1).style(notInEdiHilite)
          }
          if (Object.values(searchResXlsx_selectiveReordering[j])[i].toLowerCase().includes('requested cat')) {
            ws.cell(j + 2, i + 1).style(requestedCatHilite)
          }
          if (Object.values(searchResXlsx_selectiveReordering[j])[i].toLowerCase().includes('todo')) {
            ws.cell(j + 2, i + 1).style(toDoHilite)
          }
          if (Object.values(searchResXlsx_selectiveReordering[j])[i].toLowerCase().includes('sent retail review')) {
            ws.cell(j + 2, i + 1).style(sentRetailReviewHilite)
          }
        }

        // if (Object.keys(searchResXlsx_selectiveReordering[0])[i] == 'ediPrice') {
        //   ws.cell(j + 2, i + 1).style(ediPriceHilite)
        // }
        // if (Object.keys(searchResXlsx_selectiveReordering[0])[i] == 'sibBasePrice') {
        //   ws.cell(j + 2, i + 1).style(sibBasePriceHilite)
        // }
        // if (Object.values(searchResXlsx_selectiveReordering[j])[i] == 'invalid oupName') {
        //   ws.cell(j + 2, i + 1).style(invalidOupName)
        // }
      }
    }


    wb.write(`${process.cwd()}/public/xlsx/${req.body['xlsxPost']}.xlxs`)

    res.render('vw-dbEditPassport', { //render searchResults to vw-dbEditPassport page
      title: `<<${process.cwd()}/public/csv/${req.body['xlsxPost']}.xlxs SAVED>>`,
    })

    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // //v//Automatically add note to rainbowcat table that Retail Review has been generated//////////////////////////////////////
    // let rtlRvwFilename = req.body['xlsxPost']
    // //here we are doing some js magic to extract the "ediName" from the Rtl Rvw name we're saving (nejTableNameRtlRvwYYYMMDD):
    // // let regex1 = /(\d+)/g
    // let vendorNameSplit1 = rtlRvwFilename.split('nej')
    // let vendorNameSplit2 = vendorNameSplit1[1]
    // let vendorNameSplit3 = vendorNameSplit2.toLowerCase().split('rtlrvw')
    // let vendorName = vendorNameSplit3[0]
    // let ediVendorName = `EDI-${vendorName.toUpperCase()}`
    // console.log(`ediVendorName==> ${ediVendorName}`)

    // function updateRbCat() {
    //   connection.query(
    //     `UPDATE rainbowcat SET RtlRvw = '${req.body['xlsxPost']}.xlxs' WHERE ediName = '${ediVendorName}'`,
    //     function (err, rows, fields) {
    //       if (err) throw err
    //       res.render('vw-MySqlTableHub', {
    //         title: `<<${process.cwd()}/public/csv/${req.body['xlsxPost']}.xlxs SAVED, and rainbowcat updated>>`
    //       })
    //     })
    // }

    // updateRbCat()
    // //^//Automatically add note to rainbowcat table that Retail Review has been generated//////////////////////////////////////
    // ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  })
}