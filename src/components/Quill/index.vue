<template lang="pug">
  quill-editor.quill-editor(:content="description"  @change="onEditorChange($event)" :options="editorOption"
  @blur="onEditorBlur($event)" @focus="onEditorFocus($event)" @ready="onEditorReady($event)")
</template>

<script>
// import { VueEditor } from 'vue2-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

import {quillEditor, Quill} from 'vue-quill-editor'
// quill  img-upload
import {ImageExtend, QuillWatch} from 'quill-image-extend-module'

// quill图片可拖拽改变大小
import ImageResize from 'quill-image-resize-module'
Quill.register('modules/ImageExtend', ImageExtend)

Quill.register('modules/imageResize', ImageResize)

var fonts = ['SimSun', 'SimHei', 'Microsoft-YaHei', 'KaiTi', 'FangSong', 'Arial', 'Times-New-Roman', 'sans-serif']
var Font = Quill.import('formats/font')
Font.whitelist = fonts // 将字体加入到白名单
Quill.register(Font, true)

// var toolbars = [
//   [
//     "source", //源代码
//     "undo", //撤销
//     "redo", //重做
//     "bold", //加粗
//     "italic", //斜体
//     "underline", //下划线
//     "strikethrough", //删除线
//     "rowspacingtop", //段前距
//     "rowspacingbottom", //段后距
//     "paragraph", //段落格式
//     "fontfamily", //字体
//     "fontsize", //字号
//     "justifyleft", //居左对齐
//     "justifyright", //居右对齐
//     "justifycenter", //居中对齐
//     "justifyjustify", //两端对齐
//     "simpleupload" //单图上传
//   ]
// ];
export default {
  model: {
    prop: 'description',
    event: 'change'
  },
  props: {
    description: String,
    action: String
  },
  data () {
    return {
      editorOption: {
        modules: {
          imageResize: {},
          // imageResize: {modules: [ 'Resize', 'DisplaySize', 'Toolbar' ]},
          ImageExtend: {
            loading: true,
            name: 'file',
            size: 5,
            sizeError: () => this.$vgo.tip('图片尺寸过大!', 'warning'),
            action: window.$globalconfig.UPLOAD.IMAGE_PREFIX + this.$auth.getToken(),
            response: (res) => {
              if (res.code === 100) {
                this.$vgo.tip('操作成功!', 'success')
                return res.data[0].fullurl
              }
              this.$vgo.tip(res.msg, 'danger')
            },
            change: (xhr, formData) => {
              formData.append('action', this.action)
            }
          },
          toolbar: {
            container: [
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],
              [{ 'header': 1 }, { 'header': 2 }],
              [{ 'list': 'ordered' }, { 'list': 'bullet' }],
              [{ 'script': 'sub' }, { 'script': 'super' }],
              [{ 'indent': '-1' }, { 'indent': '+1' }],
              [{ 'direction': 'rtl' }],
              [{ 'size': ['small', false, 'large', 'huge'] }],
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
              [{ 'font': fonts }],
              [{ 'color': [] }, { 'background': [] }],
              [{ 'align': [] }],
              ['clean'],
              ['link', 'image']
            ],
            handlers: {
              'image': function (a, b, c) {
                QuillWatch.emit(this.quill.id)
              }
            }
          }
        }
      }
    }
  },
  methods: {
    onEditorChange (quill) {
      this.$emit('change', quill.html)
    },
    onEditorBlur (quill) {
    },
    onEditorFocus (quill) {
    },
    onEditorReady (quill) {
    }
  },
  components: {
    quillEditor
  }
}
</script>
<style lang="stylus">

// vue-quill-editor
.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimSun]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimSun]::before
  content: "宋体"
  font-family: "SimSun"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=SimHei]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=SimHei]::before
  content: "黑体"
  font-family: "SimHei"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Microsoft-YaHei]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Microsoft-YaHei]::before
  content: "微软雅黑"
  font-family: "Microsoft YaHei"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=KaiTi]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=KaiTi]::before
  content: "楷体"
  font-family: "KaiTi"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=FangSong]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=FangSong]::before
  content: "仿宋"
  font-family: "FangSong"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Arial]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Arial]::before
  content: "Arial"
  font-family: "Arial"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=Times-New-Roman]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=Times-New-Roman]::before
  content: "Times New Roman"
  font-family: "Times New Roman"

.ql-snow .ql-picker.ql-font .ql-picker-label[data-value=sans-serif]::before,
.ql-snow .ql-picker.ql-font .ql-picker-item[data-value=sans-serif]::before
  content: "sans-serif"
  font-family: "sans-serif"

.ql-font-SimSun
    font-family: "SimSun"

.ql-font-SimHei
    font-family: "SimHei"

.ql-font-Microsoft-YaHei
    font-family: "Microsoft YaHei"

.ql-font-KaiTi
    font-family: "KaiTi"

.ql-font-FangSong
    font-family: "FangSong"

.ql-font-Arial
    font-family: "Arial"

.ql-font-Times-New-Roman
    font-family: "Times New Roman"

.ql-font-sans-serif
    font-family: "sans-serif"

</style>
