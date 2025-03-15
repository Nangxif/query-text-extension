import { defaultValues } from '@/constants';
import {
  Button,
  ColorPicker,
  ConfigProvider,
  Form,
  message,
  Switch,
} from 'antd';
import { useEffect } from 'react';
import ShortcutPicker from './ShortcutPicker';
import styles from './index.less';

const { Item: FormItem, useForm } = Form;
type FormValues = {
  shortcut: string[];
  color: string;
  fixed: boolean;
};

const Sidebar: React.FC = () => {
  const [form] = useForm<FormValues>();

  // 初始化数据
  useEffect(() => {
    chrome.storage.sync.get(['shortcut', 'color', 'fixed'], (result) => {
      form.setFieldsValue(result);
    });
  }, []);

  const handleSubmit = (values: FormValues) => {
    const metaColor = (values.color as any).metaColor;
    const color = `rgba(${metaColor?.r},${metaColor?.g},${metaColor?.b},${metaColor?.a})`;
    chrome.storage.sync.set({
      shortcut: values.shortcut,
      color: color,
      fixed: values.fixed,
    });
    message.success('保存成功，刷新页面之后配置才可生效');
  };
  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            colorPrimary: 'rgb(0 120 212)',
          },
          Switch: {
            colorPrimary: 'rgb(0 120 212)',
          },
          Select: {
            borderRadius: 4,
            colorBgContainer: 'rgb(49 49 49)',
            colorText: '#bbb',
            multipleItemBg: 'rgb(32 32 32)',
            optionSelectedBg: 'rgb(32 32 32)',
            optionActiveBg: 'rgb(32 32 32)',
          },
        },
      }}
    >
      <Form
        form={form}
        initialValues={defaultValues}
        className={styles.container}
        onFinish={handleSubmit}
      >
        <FormItem
          label="自定义搜索快捷键"
          name="shortcut"
          className={styles['form-item']}
          rules={[
            {
              required: true,
              message: '请选择自定义搜索快捷键',
            },
            {
              validator(_, value) {
                if (value.length < 2) {
                  return Promise.reject(
                    new Error('至少选择两个自定义搜索快捷键'),
                  );
                }
                return Promise.resolve();
              },
              message: '至少选择两个自定义搜索快捷键',
            },
          ]}
        >
          <ShortcutPicker />
        </FormItem>
        <FormItem
          label="命中的文字颜色"
          name="color"
          className={styles['form-item']}
        >
          <ColorPicker format="rgb" />
        </FormItem>
        <FormItem
          label="固定位置"
          name="fixed"
          className={styles['form-item']}
          valuePropName="checked"
        >
          <Switch />
        </FormItem>
        <Button type="primary" htmlType="submit" className={styles['save-btn']}>
          保存
        </Button>
      </Form>
    </ConfigProvider>
  );
};

export default Sidebar;
