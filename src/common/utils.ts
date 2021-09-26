import { config } from "./config";

export const utils = {
  createSlug: str => {
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
    str = str.replace(/đ/g, "d");
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
    str = str.replace(/Đ/g, "D");

    str = str.replace(" ", "-");
    return str;
  },
  formatNumber: number => {
    if (!number) {
      return "";
    }
    return Math.floor(number)
      .toString()
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
  },
  renderImage(images: string[]) {
    let res = "<div>";
    images.forEach(item => {
      if (item) {
        let img = `<img src='${
          config.apiUrl
        }/${item}' style="width: 20px;height: 20px;" />`;
        let str = `<a target="_blank" href="${
          config.apiUrl
        }/${item}" style='float:left;padding-right: 10px'>${img}</a>`;
        res += str;
      }
    });
    res += "</div>";
    console.log(res);
    return res;
  },
  convertDataToTreeView: (data) => {
    let listOrigin = [];
    listOrigin = data.filter(item => item.ParentId === 0);
    data = data.filter(item => item.ParentId !== 0);
    
    listOrigin.forEach(origin => {
        origin.children = data.filter(item => {return item.ParentId === origin.MenuId} );
        data = data.filter(item => {return item.ParentId !== origin.MenuId });
        if(data.length > 0) {
          utils.convertDataToTreeView(data);
        }
    })
    return listOrigin;
  }
};
