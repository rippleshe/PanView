import { Modal, Button, Divider, Typography } from 'antd'
import { X, FileText, Github, Heart, Code, Zap } from 'lucide-react'
import './AboutDialog.css'

const { Title, Paragraph, Text } = Typography

export function AboutDialog({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title={null}
      footer={null}
      width={500}
      className="about-modal"
      closeIcon={<X size={20} />}
    >
      <div className="about-content">
        <div className="about-header">
          <div className="about-logo">
            <FileText size={48} className="logo-icon" />
          </div>
          <Title level={2} className="about-title">
            PanView
          </Title>
          <Text type="secondary" className="about-version">
            版本 1.0.0
          </Text>
        </div>

        <Divider className="about-divider" />

        <div className="about-body">
          <Paragraph className="about-description">
            PanView 是一个现代化的 Pandoc 图形界面工具，让您无需记忆复杂的命令行参数，轻松完成文档格式转换。
          </Paragraph>

          <div className="about-features">
            <div className="feature-item">
              <Zap size={20} className="feature-icon" />
              <Text>直观的拖拽式文件操作</Text>
            </div>
            <div className="feature-item">
              <Code size={20} className="feature-icon" />
              <Text>丰富的参数配置选项</Text>
            </div>
            <div className="feature-item">
              <Heart size={20} className="feature-icon" />
              <Text>预设管理与快速加载</Text>
            </div>
          </div>

          <Divider className="about-divider" />

          <div className="about-info">
            <div className="info-item">
              <Text type="secondary">开发者：</Text>
              <Text>PanView Team</Text>
            </div>
            <div className="info-item">
              <Text type="secondary">许可证：</Text>
              <Text>MIT License</Text>
            </div>
            <div className="info-item">
              <Text type="secondary">基于：</Text>
              <Text>Electron + React + TypeScript</Text>
            </div>
          </div>
        </div>

        <div className="about-footer">
          <Button
            type="primary"
            icon={<Github size={16} />}
            onClick={() => window.open('https://github.com', '_blank')}
            className="github-button"
          >
            在 GitHub 上查看
          </Button>
          <Button onClick={onClose} className="close-button">
            关闭
          </Button>
        </div>
      </div>
    </Modal>
  )
}
