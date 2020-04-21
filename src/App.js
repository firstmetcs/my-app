import React from 'react';
// import logo from './logo.svg'
import './App.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    document
      .getElementById('textarea')
      .addEventListener('mousedown', this.posCursor);
    document
      .getElementById('textarea')
      .addEventListener('mouseup', this.posCursor);
  }

  posCursor() {
    let isIE = !!document.all;
    let start = 0,
      end = 0;
    let oTextarea = document.getElementById('textarea');
    if (isIE) {
      //selection 当前激活选中区，即高亮文本块，和/或文当中用户可执行某些操作的其它元素。
      //createRange 从当前文本选中区中创建 TextRange 对象，
      //或从控件选中区中创建 controlRange 集合。
      let sTextRange = document.selection.createRange();

      //判断选中的是不是textarea对象
      if (sTextRange.parentElement() === oTextarea) {
        //创建一个TextRange对象
        let oTextRange = document.body.createTextRange();
        //移动文本范围以便范围的开始和结束位置能够完全包含给定元素的文本。
        oTextRange.moveToElementText(oTextarea);

        //此时得到两个 TextRange
        //oTextRange文本域(textarea)中文本的TextRange对象
        //sTextRange是选中区域文本的TextRange对象

        //compareEndPoints方法介绍，compareEndPoints方法用于比较两个TextRange对象的位置
        //StartToEnd  比较TextRange开头与参数TextRange的末尾。
        //StartToStart比较TextRange开头与参数TextRange的开头。
        //EndToStart  比较TextRange末尾与参数TextRange的开头。
        //EndToEnd    比较TextRange末尾与参数TextRange的末尾。

        //moveStart方法介绍，更改范围的开始位置
        //character 按字符移动
        //word       按单词移动
        //sentence  按句子移动
        //textedit  启动编辑动作

        //这里我们比较oTextRange和sTextRange的开头，的到选中区域的开头位置
        for (
          start = 0;
          oTextRange.compareEndPoints('StartToStart', sTextRange) < 0;
          start++
        ) {
          oTextRange.moveStart('character', 1);
        }
        //需要计算一下\n的数目(按字符移动的方式不计\n,所以这里加上)
        for (let i = 0; i <= start; i++) {
          if (oTextarea.value.charAt(i) === '\n') {
            start++;
          }
        }

        //再计算一次结束的位置
        oTextRange.moveToElementText(oTextarea);
        for (
          end = 0;
          oTextRange.compareEndPoints('StartToEnd', sTextRange) < 0;
          end++
        ) {
          oTextRange.moveStart('character', 1);
        }
        for (let i = 0; i <= end; i++) {
          if (oTextarea.value.charAt(i) === '\n') {
            end++;
          }
        }
      }
    } else {
      start = oTextarea.selectionStart;
      end = oTextarea.selectionEnd;
    }
    document.getElementById('start').value = start;
    document.getElementById('end').value = end;
  }

  moveCursor(e) {
    if (e.target.type === 'button') {
      let isIE = !!document.all;
      let oTextarea = document.getElementById('textarea');
      let start = parseInt(document.getElementById('start').value);
      let end = parseInt(document.getElementById('end').value);
      if (isNaN(start) || isNaN(end)) {
        alert('位置输入错误');
      }
      if (isIE) {
        let oTextRange = oTextarea.createTextRange();
        let LStart = start;
        let LEnd = end;
        start = 0;
        end = 0;
        let value = oTextarea.value;
        for (let i = 0; i < value.length && i < LStart; i++) {
          let c = value.charAt(i);
          if (c !== '\n') {
            start++;
          }
        }
        for (let i = value.length - 1; i >= LEnd && i >= 0; i--) {
          let c = value.charAt(i);
          if (c !== '\n') {
            end++;
          }
        }
        oTextRange.moveStart('character', start);
        oTextRange.moveEnd('character', -end);
        //oTextRange.collapse(true);
        oTextRange.select();
        oTextarea.focus();
      } else {
        oTextarea.select();
        oTextarea.selectionStart = start;
        oTextarea.selectionEnd = end;
      }
    }
  }

  render() {
    return (
      <table border="1" cellSpacing="0" cellPadding="0">
        <tbody>
          <tr>
            <td>
              start: <input type="text" id="start" size="3" defaultValue="0" />
            </td>
            <td>
              end: <input type="text" id="end" size="3" defaultValue="0" />
            </td>
          </tr>
          <tr>
            <td colSpan="2">
              <textarea
                id="textarea"
                // onKeyDown="posCursor()"
                // onKeyUp="posCursor()"
                // οnmοusedοwn="posCursor()"
                // οnmοuseup="posCursor()"
                // οnfοcus="posCursor()"
                rows="14"
                cols="50"
                defaultValue="虞美人 春花秋月何时了，往事知多少。
                小楼昨夜又东风，故国不堪回首月明中！
                雕l栏玉砌应犹在，只是朱颜改。
                问君能有几多愁？恰似一江春水向东流。"
              />
            </td>
          </tr>
          <tr>
            <td></td>
            <td>
              <input
                type="button"
                onClick={this.moveCursor}
                value="设置光标位置"
              />
            </td>
          </tr>
        </tbody>
      </table>
    );
  }
}
