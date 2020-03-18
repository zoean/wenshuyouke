/**
 * Created by ZOE on 20/03/18
 */

/** format template String
 * ellipsis 字符串切割 
 * transDateSub 截取时间戳（10位）
 * 
 * 
 * 
 */
import { parseTime} from '@/utils/index'
const filters = {
	ellipsis: function (str, len){//字符串切割
		if(!str || str.length <= 0){
      return '--'
    }
    if(str.length*2 <= len) {
	    return str
	  }
	  var strlen = 0
	  var s = ""
	  for(var i = 0;i < str.length; i++) {
      s = s + str.charAt(i)
      if (str.charCodeAt(i) > 128) {
        strlen = strlen + 2
        if(strlen >= len){
            return s.substring(0,s.length-1) + "..."
        }
      } else {
        strlen = strlen + 1
        if(strlen >= len){
            return s.substring(0,s.length-2) + "..."
        }
      }
	  }
	  return s
	},
  transDateSub: function (val){
    if(val){
      return parseTime(val).substring(0, 10)
    }else{
      return '--'
    } 
  },
  parseDateTime: function (time, cFormat){
    if(!time){
      return '--'
    }else{
      return time.replace(/T/g, " ").substring(0, 19)
    }
  }
}
export default (Vue) => {//导出所有filters
  Object.keys(filters).forEach(key => {
      Vue.filter(key, filters[key])
  })
}