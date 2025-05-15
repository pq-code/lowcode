import { defineComponent, ref, watch } from 'vue';
import { ElButton, ElIcon } from 'element-plus';
import { ArrowLeft, ArrowRight, Check } from '@element-plus/icons-vue';
import './StepPanel.css';

export interface StepItem {
  title: string;
  description?: string;
  icon?: any;
}

const StepPanel = defineComponent({
  name: 'StepPanel',
  props: {
    steps: {
      type: Array as () => StepItem[],
      required: true
    },
    currentStep: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      default: false
    },
    nextButtonText: {
      type: String,
      default: '下一步'
    },
    prevButtonText: {
      type: String,
      default: '上一步'
    },
    finishButtonText: {
      type: String,
      default: '完成'
    },
    canNext: {
      type: Boolean,
      default: true
    },
    canPrev: {
      type: Boolean,
      default: true
    },
    canFinish: {
      type: Boolean,
      default: true
    }
  },
  emits: ['update:currentStep', 'prev', 'next', 'finish'],
  setup(props, { emit, slots }) {
    const internalCurrentStep = ref(props.currentStep);
    
    // 监听currentStep变化
    watch(() => props.currentStep, (newStep) => {
      internalCurrentStep.value = newStep;
    });
    
    // 监听内部currentStep变化
    watch(() => internalCurrentStep.value, (newStep) => {
      emit('update:currentStep', newStep);
    });
    
    // 上一步
    const handlePrev = () => {
      if (internalCurrentStep.value > 0 && props.canPrev) {
        internalCurrentStep.value--;
        emit('prev', internalCurrentStep.value);
      }
    };
    
    // 下一步
    const handleNext = () => {
      if (internalCurrentStep.value < props.steps.length - 1 && props.canNext) {
        internalCurrentStep.value++;
        emit('next', internalCurrentStep.value);
      }
    };
    
    // 完成
    const handleFinish = () => {
      if (props.canFinish) {
        emit('finish');
      }
    };
    
    return {
      internalCurrentStep,
      handlePrev,
      handleNext,
      handleFinish
    };
  },
  render() {
    const isLastStep = this.internalCurrentStep === this.steps.length - 1;
    const slotName = `step-${this.internalCurrentStep}`;
    
    return (
      <div class="step-panel">
        {/* <div class="step-header">
          {this.steps.map((step, index) => (
            <div 
              key={index} 
              class={[
                'step-item', 
                { 
                  'active': index === this.internalCurrentStep,
                  'completed': index < this.internalCurrentStep
                }
              ]}
            >
              <div class="step-icon">
                {index < this.internalCurrentStep ? (
                  <ElIcon><Check /></ElIcon>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <div class="step-content">
                <div class="step-title">{step.title}</div>
                {step.description && <div class="step-description">{step.description}</div>}
              </div>
              {index < this.steps.length - 1 && <div class="step-line"></div>}
            </div>
          ))}
        </div> */}
        
        <div class="step-body">
          {this.$slots[slotName] && this.$slots[slotName]()}
        </div>
        
        <div class="step-footer">
          <div class="step-info">
            步骤 {this.internalCurrentStep + 1}/{this.steps.length}: {this.steps[this.internalCurrentStep]?.title}
          </div>
          
          <div class="step-actions">
            {this.internalCurrentStep > 0 && (
              <ElButton 
                onClick={this.handlePrev}
                disabled={!this.canPrev}
              >
                <ElIcon class="el-icon--left"><ArrowLeft /></ElIcon>
                {this.prevButtonText}
              </ElButton>
            )}
            
            {!isLastStep ? (
              <ElButton 
                type="primary" 
                onClick={this.handleNext}
                disabled={!this.canNext}
                loading={this.loading}
              >
                {this.nextButtonText}
                <ElIcon class="el-icon--right"><ArrowRight /></ElIcon>
              </ElButton>
            ) : (
              <ElButton 
                type="success" 
                onClick={this.handleFinish}
                disabled={!this.canFinish}
                loading={this.loading}
              >
                {this.finishButtonText}
                <ElIcon class="el-icon--right"><Check /></ElIcon>
              </ElButton>
            )}
          </div>
        </div>
      </div>
    );
  }
});

export default StepPanel; 