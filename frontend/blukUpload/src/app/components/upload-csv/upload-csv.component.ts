import { Component, HostListener } from '@angular/core';
import { UploadCsvService } from './upload-csv.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { success } from 'src/app/interfaces/success.interface';
import { errors } from 'src/app/interfaces/errors.interface';
import * as XLSX from "xlsx";

@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent {


  files: any[] = []
  msg: string | undefined;
  errmsg: string | undefined
  successArray: success[] | undefined
  errorsArray: errors[] | undefined
  arr: any[] = []
  disable: boolean = false;
  jsonData: any;

  constructor(private uploadcsvservice: UploadCsvService,
    private ngxLoader: NgxUiLoaderService,) { }

  ngOnInit() { }

  // csvJSON(csvText: any) {
  //   var lines = csvText.split("\n");
  //   var result = [];
  //   var headers = lines[0].split(",");
  //   console.log(headers);
  //   for (var i = 1; i < lines.length - 1; i++) {
  //     var obj = {}
  //     var currentline = lines[i].split(",");

  //     for (var j = 0; j < headers.length; j++) {
  //       obj[headers[j]] = currentline[j];
  //     }
  //     result.push(obj);
  //   }
  //   console.log(JSON.stringify(result)); //JSON
  //   this.jsonData = JSON.stringify(result);
  // }


  
  
  
    submit() {
      console.log("file : --- ", this.files)
  
      // const filereader: FileReader = new FileReader();
      // const selectedfile = this.files[0];
      // filereader.readAsText(selectedfile);
      // filereader.onload = () => {
      //   let text = filereader.result;
      //   console.log(text);
      //   this.csvJSON(text);
      // };
  
  
  
      // ----- convert csv to json by using XLSX module -----
  
      const filereader: FileReader = new FileReader();
      const selectedfile = this.files[0];
      filereader.readAsBinaryString(selectedfile);
      filereader.onload = async (event: any) => {
        let binarydata = event.target.result;
        let workbook = XLSX.read(binarydata, { type: 'binary' })
        workbook.SheetNames.forEach(sheet => {
          const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet]);
          console.log(data);
          this.jsonData = data
        })
        console.log("data :", this.jsonData); //JSON
        this.checkDataValidation(this.jsonData)  // call validation function
      }


    }
  
  
    checkDataValidation(data: []) {
    console.log("---- fay ====", )
    }
  
  
    uploadData() {
      if (this.files.length > 0) {
        this.ngxLoader.start();
        this.uploadcsvservice.upload(this.jsonData).subscribe((res: any) => {
          console.log(res)
          this.msg = res['msg']
          this.successArray = res.data['successArray']
          this.errorsArray = res.data['errorsArray']
          this.createExcelSheet()
          this.ngxLoader.stop();
        }, (err: any) => {
          console.log("err : ", err)
          this.errmsg = err.error.msg
          this.ngxLoader.stop();
        })
      } else {
        this.errmsg = "please select file"
      }
      setTimeout(() => {
        this.msg = undefined;
        this.errmsg = undefined;
      }, 3000);
    }
  
  
  
  
  // for select file
  
  selectedFiles(event: any) {
    let type = event.target.files[0].type;
    this.msg = undefined
    if (type != "text/csv") {
      this.errmsg = "please select 'csv' file"
    } else {
      this.errmsg = undefined
      this.files = <Array<File>>event.target.files;
      this.disable = true
    }
    setTimeout(() => {
      this.msg = undefined;
      this.errmsg = undefined
    }, 3000);
  }




  // for drag and drop 

  @HostListener('dragover', ['$event']) public onDragOnOver(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("called ... drag over")
  }

  @HostListener('dragleave', ['$event']) public onDragOnLeave(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    console.log("called ... leave drag")
  }
  
  @HostListener('drop', ['$event']) public ondrop(evt: any) {
    evt.preventDefault();
    evt.stopPropagation();
    const files = evt.dataTransfer.files;
    if (files.length > 0) {
      console.log(`you dropeed ${files.length} files`, files)
    }
    let type = files[0].type;
    if (files.length > 1) this.errmsg = "Only one file at time allow";
    else {
      if (type != "text/csv") {
        this.errmsg = "please select 'csv' file"
      }
      else {
        this.files = []
        this.errmsg = undefined;
        for (const item of files) {
          this.files.push(item);
        }
        this.disable = true
      }
    }
    setTimeout(() => {
      this.msg = undefined;
      this.errmsg = undefined;
    }, 3000);
  }
  
  onFileDropeed($event: any) {
    if (this.files.length > 1) this.errmsg = "Only one file at time allow";
    else {
      this.errmsg = undefined;
      for (const item of $event) {
        this.files.push(item);
      }
    }
    console.log("files :", this.files)
  }
  
  
  
  // for convert json/array to excel file
  
  createExcelSheet() {
    const fileName = "results.xlsx";
    const sheetName = ["success", "errors",];
    this.arr = [this.successArray, this.errorsArray]
    let wb = XLSX.utils.book_new();
    for (var i = 0; i < sheetName.length; i++) {
      let ws = XLSX.utils.json_to_sheet(this.arr[i]);
      XLSX.utils.book_append_sheet(wb, ws, sheetName[i]);
    }
    XLSX.writeFile(wb, fileName);
  }
}

