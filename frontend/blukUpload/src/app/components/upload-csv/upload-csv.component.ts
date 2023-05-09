import { Component, HostListener } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { errors } from 'src/app/interfaces/errors.interface';
import { success } from 'src/app/interfaces/success.interface';
import * as XLSX from "xlsx";
import { UploadCsvService } from './upload-csv.service';
@Component({
  selector: 'app-upload-csv',
  templateUrl: './upload-csv.component.html',
  styleUrls: ['./upload-csv.component.scss']
})
export class UploadCsvComponent {

  headers = ['prefix', 'first_name', 'last_name', 'email', 'phone_no', 'age']
  files: any[] = []
  msg: string | undefined;
  errmsg: string | undefined
  successArray: success[] | undefined
  errorsArray: errors[] | undefined
  arr: any[] = []
  jsonData: any;
  obj: any = {};
  show : boolean = true;

  constructor(private uploadcsvservice: UploadCsvService,
    private ngxLoader: NgxUiLoaderService,
    private toastr: ToastrService) { }

  ngOnInit() { }

  csvJSON(csvText: any) {
    let lines = csvText.split("\n");
    let result = []; 
    let headers = lines[0].split(",");

    const equalValues = (this.headers.length === headers.length) && this.headers.every((value, index) => value === headers[index]);

    if (equalValues) {
      console.log("The arrays have equal values.");
      for (let i = 1; i < lines.length - 1; i++) {
        this.obj = {}
        let currentline = lines[i].split(",");

        for (let j = 0; j < headers.length; j++) {
          this.obj[headers[j]] = currentline[j];
        }
        result.push(this.obj);
      }
      return result;
    } else {
      console.log("The arrays do not have equal values.");
      return false;
    }

  }





  submit() {
    const filereader: FileReader = new FileReader();
    const selectedfile = this.files[0];
    if (selectedfile) {
      filereader.readAsText(selectedfile);
      filereader.onload = () => {
        let text = filereader.result;
        console.log(text);
        this.jsonData = this.csvJSON(text);
        if (this.jsonData) {
          this.uploadData(this.jsonData);
        } else {
          this.errmsg = "The Column Headers Wrongs. Please Follow the instructions"
          this.showError(this.errmsg);
        }
      };
    }
    else {
      this.errmsg = "Please select file to upload.";
      this.showError(this.errmsg);

    }
    setTimeout(() => {
      this.msg = undefined;
      this.errmsg = undefined;
    }, 5000);

  }





  uploadData(data: any) {
    if (this.files.length > 0) {
      this.ngxLoader.start();
      this.uploadcsvservice.upload(data).subscribe((res: any) => {
        console.log(res)
        this.msg = res['msg']
        this.successArray = res['successArray']
        this.errorsArray = res['errorsArray']
        this.createExcelSheet()
        this.ngxLoader.stop();
        this.show = false;

      }, (err: any) => {
        console.log("err : ", err)
        this.errmsg = "Internal Server Error";
        this.ngxLoader.stop();
        this.showError(this.errmsg);

      })
    } else {
      this.errmsg = "Please select file to upload."
    }
    setTimeout(() => {
      this.msg = undefined;
      this.errmsg = undefined;
    }, 5000);
  }




  // for select file

  selectedFiles(event: any) {
    let type = event.target.files[0].type;
    this.msg = undefined
    if (type != "text/csv") {
      this.errmsg = "please select 'csv' file"
      this.showError(this.errmsg);

    } else {
      this.errmsg = undefined
      this.files = <Array<File>>event.target.files;
    }
    setTimeout(() => {
      this.msg = undefined;
      this.errmsg = undefined
    }, 5000);
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
      }
    }
    setTimeout(() => {
      this.msg = undefined;
      this.errmsg = undefined;
    }, 5000);
  }

  onFileDropeed($event: any) {
    if (this.files.length > 1) {
      this.errmsg = "Only one file at time allow";
      this.showError(this.errmsg);
    }
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


  showSuccess(msg: string) {
    this.toastr.success(msg, 'Success !');
  }
  showError(msg: string) {
    this.toastr.error(msg, 'Error !');
  }
}

