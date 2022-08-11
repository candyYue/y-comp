import Vue from 'vue'
class LoadingProgress {
  constructor (props) {
    this.instance = null
    this.$el = null
    this.displayValue = props.initValue
    this.onEnd = props.onEnd
    this.update(props.initValue)
    this.render()
  }
  render () {
    const progress = this
    this.instance = new Vue({
      name: 'loading-progress',
      data () {
        return {
          loadingPercent: progress.displayValue
        }
      },
      watch: {
        loadingPercent (val) {
          if (val >= 100) {
            const timer = setTimeout(() => {
              this.$destroy()
              progress.onEnd()
              clearTimeout(timer)
            }, 300)
          }
        }
      },
      render () {
        return (<div class="loading-progress-mask" v-show="visible">
          <div class="loading-progress">
            <div>
              <ul>
                <li></li><li></li><li></li><li></li><li></li>
              </ul>
              <span>Loading… {this.loadingPercent}%</span>
            </div>
          </div>
        </div>)
      },
      destroyed () {
        progress.close()
      }
    })
    this.$el = this.instance.$mount().$el
    document.querySelector('body').appendChild(this.$el)
  }
  update (value) {
    this.displayValue = value
    if (this.instance) {
      this.instance.loadingPercent = value
    }
  }
  close () {
    document.querySelector('body').removeChild(this.$el)
  }
}
const loadingProgress = (value) => new LoadingProgress(value)
export default loadingProgress
