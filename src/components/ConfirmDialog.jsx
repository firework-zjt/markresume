import './ConfirmDialog.css'

function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null

  return (
    <div className="confirm-dialog-overlay" onClick={onCancel}>
      <div className="confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-dialog-header">
          <h3>{title || '确认删除'}</h3>
        </div>
        <div className="confirm-dialog-body">
          <p>{message || '确定要删除吗？此操作不可恢复。'}</p>
        </div>
        <div className="confirm-dialog-footer">
          <button className="btn-cancel" onClick={onCancel}>
            取消
          </button>
          <button className="btn-confirm" onClick={onConfirm}>
            确定
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
