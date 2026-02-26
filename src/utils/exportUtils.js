import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

// 临时移除选中状态的背景颜色
const removeActiveStyles = () => {
  const style = document.createElement('style')
  style.id = 'export-hide-active-styles'
  style.textContent = `
    .resume-section.active-section {
      background-color: transparent !important;
      animation: none !important;
    }
    .experience-item.active-item,
    .education-item.active-item,
    .project-item.active-item {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      animation: none !important;
    }
  `
  document.head.appendChild(style)
  return style
}

// 恢复选中状态的背景颜色
const restoreActiveStyles = (styleElement) => {
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement)
  }
}

// 导出为 PDF
export const exportToPDF = async (resumeData) => {
  let activeStyleElement = null
  try {
    const previewElement = document.querySelector('.resume-preview')
    if (!previewElement) {
      throw new Error('找不到预览区域')
    }

    // 临时移除选中状态的背景颜色
    activeStyleElement = removeActiveStyles()

    // 保存原始样式和滚动位置
    const originalOverflow = previewElement.style.overflow
    const originalScrollTop = previewElement.scrollTop
    const originalScrollLeft = previewElement.scrollLeft
    
    // 确保元素完全可见
    previewElement.style.overflow = 'visible'
    previewElement.scrollTop = 0
    previewElement.scrollLeft = 0

    // 等待内容渲染
    await new Promise(resolve => setTimeout(resolve, 100))

    // 获取元素的完整尺寸
    const elementHeight = previewElement.scrollHeight
    const elementWidth = previewElement.scrollWidth

    // 使用 html2canvas 将预览区域转换为图片，确保捕获完整内容
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      height: elementHeight,
      width: elementWidth,
      scrollX: 0,
      scrollY: 0,
      windowWidth: elementWidth,
      windowHeight: elementHeight,
      allowTaint: false,
      removeContainer: false
    })

    // 恢复原始样式和滚动位置
    previewElement.style.overflow = originalOverflow
    previewElement.scrollTop = originalScrollTop
    previewElement.scrollLeft = originalScrollLeft
    
    // 恢复选中状态的背景颜色
    restoreActiveStyles(activeStyleElement)

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    
    // 将像素转换为mm (1px = 0.264583mm at 96dpi)
    const imgWidthMM = imgWidth * 0.264583
    const imgHeightMM = imgHeight * 0.264583
    
    // 计算缩放比例，确保图片宽度适配页面（留20mm边距）
    const pageContentWidth = pdfWidth - 20
    const pageContentHeight = pdfHeight - 20
    const scale = Math.min(pageContentWidth / imgWidthMM, 1) // 不放大，只缩小
    
    const scaledWidth = imgWidthMM * scale
    const scaledHeight = imgHeightMM * scale
    const xOffset = (pdfWidth - scaledWidth) / 2
    
    // 如果内容超过一页，需要分页
    if (scaledHeight <= pageContentHeight) {
      // 内容在一页内，直接添加
      pdf.addImage(imgData, 'PNG', xOffset, 10, scaledWidth, scaledHeight)
      pdf.save('简历.pdf')
    } else {
      // 内容超过一页，需要分页
      const totalPages = Math.ceil(scaledHeight / pageContentHeight)
      const img = new Image()
      
      img.onload = () => {
        for (let i = 0; i < totalPages; i++) {
          if (i > 0) {
            pdf.addPage()
          }
          
          const sourceY = (i * pageContentHeight) / scale / 0.264583
          const sourceHeight = Math.min(
            pageContentHeight / scale / 0.264583,
            imgHeight - sourceY
          )
          const displayHeight = Math.min(
            pageContentHeight,
            scaledHeight - (i * pageContentHeight)
          )
          
          // 创建临时canvas来裁剪图片
          const tempCanvas = document.createElement('canvas')
          tempCanvas.width = imgWidth
          tempCanvas.height = sourceHeight
          const tempCtx = tempCanvas.getContext('2d')
          tempCtx.drawImage(img, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight)
          const croppedImgData = tempCanvas.toDataURL('image/png')
          
          pdf.addImage(croppedImgData, 'PNG', xOffset, 10, scaledWidth, displayHeight)
        }
        
        pdf.save('简历.pdf')
      }
      
      img.src = imgData
    }

    pdf.save('简历.pdf')
  } catch (error) {
    console.error('导出 PDF 失败:', error)
    alert('导出 PDF 失败，请重试')
    // 确保恢复样式
    restoreActiveStyles(activeStyleElement)
  }
}

// 导出为 Word
export const exportToWord = async (resumeData) => {
  try {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // 基本信息
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.基本信息.姓名 || '',
                bold: true,
                size: 32
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.基本信息.职位 || '',
                size: 24
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: `电话: ${resumeData.基本信息.电话 || ''} | 邮箱: ${resumeData.基本信息.邮箱 || ''} | 地址: ${resumeData.基本信息.地址 || ''}`,
                size: 20
              })
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: resumeData.基本信息.自我介绍 || '',
                size: 20
              })
            ]
          }),
          new Paragraph({ text: '' }), // 空行

          // 工作经历
          new Paragraph({
            children: [
              new TextRun({
                text: '工作经历',
                bold: true,
                size: 28
              })
            ]
          }),
          ...resumeData.工作经历.flatMap(item => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${item.职位} - ${item.公司}`,
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${item.开始时间} - ${item.结束时间} | ${item.地点}`,
                  size: 20
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: item.职责 || '',
                  size: 20
                })
              ]
            }),
            ...item.亮点.map(highlight => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${highlight}`,
                    size: 20
                  })
                ]
              })
            ),
            new Paragraph({ text: '' })
          ]),

          // 教育背景
          new Paragraph({
            children: [
              new TextRun({
                text: '教育背景',
                bold: true,
                size: 28
              })
            ]
          }),
          ...resumeData.教育背景.flatMap(item => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${item.学校} - ${item.学历}, ${item.专业}`,
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${item.开始时间} - ${item.结束时间} | GPA: ${item.GPA}`,
                  size: 20
                })
              ]
            }),
            ...item.亮点.map(highlight => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${highlight}`,
                    size: 20
                  })
                ]
              })
            ),
            new Paragraph({ text: '' })
          ]),

          // 技能清单
          new Paragraph({
            children: [
              new TextRun({
                text: '技能清单',
                bold: true,
                size: 28
              })
            ]
          }),
          ...Object.entries(resumeData.技能清单).map(([category, items]) =>
            new Paragraph({
              children: [
                new TextRun({
                  text: `${category}: ${Array.isArray(items) ? items.join(', ') : items}`,
                  size: 20
                })
              ]
            })
          ),
          new Paragraph({ text: '' }),

          // 项目经历
          new Paragraph({
            children: [
              new TextRun({
                text: '项目经历',
                bold: true,
                size: 28
              })
            ]
          }),
          ...resumeData.项目经历.flatMap(item => [
            new Paragraph({
              children: [
                new TextRun({
                  text: `${item.项目名称} - ${item.角色}`,
                  bold: true,
                  size: 24
                })
              ]
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: item.描述 || '',
                  size: 20
                })
              ]
            }),
            ...item.亮点.map(highlight => 
              new Paragraph({
                children: [
                  new TextRun({
                    text: `• ${highlight}`,
                    size: 20
                  })
                ]
              })
            ),
            new Paragraph({ text: '' })
          ])
        ]
      }]
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, '简历.docx')
  } catch (error) {
    console.error('导出 Word 失败:', error)
    alert('导出 Word 失败，请重试')
  }
}

// 导出为 Markdown
export const exportToMarkdown = (resumeData) => {
  try {
    let markdown = `# ${resumeData.基本信息.姓名 || ''}\n\n`
    markdown += `**${resumeData.基本信息.职位 || ''}**\n\n`
    markdown += `📞 ${resumeData.基本信息.电话 || ''} | ✉️ ${resumeData.基本信息.邮箱 || ''} | 📍 ${resumeData.基本信息.地址 || ''}\n\n`
    markdown += `${resumeData.基本信息.自我介绍 || ''}\n\n`
    markdown += `---\n\n`

    // 工作经历
    markdown += `## 工作经历\n\n`
    resumeData.工作经历.forEach(item => {
      markdown += `### ${item.职位} - ${item.公司}\n\n`
      markdown += `**${item.开始时间} - ${item.结束时间}** | ${item.地点}\n\n`
      markdown += `${item.职责 || ''}\n\n`
      item.亮点.forEach(highlight => {
        markdown += `- ${highlight}\n`
      })
      markdown += `\n`
    })

    // 教育背景
    markdown += `## 教育背景\n\n`
    resumeData.教育背景.forEach(item => {
      markdown += `### ${item.学校}\n\n`
      markdown += `**${item.学历}, ${item.专业}** | ${item.开始时间} - ${item.结束时间} | GPA: ${item.GPA}\n\n`
      item.亮点.forEach(highlight => {
        markdown += `- ${highlight}\n`
      })
      markdown += `\n`
    })

    // 技能清单
    markdown += `## 技能清单\n\n`
    Object.entries(resumeData.技能清单).forEach(([category, items]) => {
      markdown += `**${category}:** ${Array.isArray(items) ? items.join(', ') : items}\n\n`
    })

    // 项目经历
    markdown += `## 项目经历\n\n`
    resumeData.项目经历.forEach(item => {
      markdown += `### ${item.项目名称} - ${item.角色}\n\n`
      markdown += `${item.描述 || ''}\n\n`
      item.亮点.forEach(highlight => {
        markdown += `- ${highlight}\n`
      })
      markdown += `\n`
    })

    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    saveAs(blob, '简历.md')
  } catch (error) {
    console.error('导出 Markdown 失败:', error)
    alert('导出 Markdown 失败，请重试')
  }
}

// 导出为 JSON
export const exportToJSON = (resumeData) => {
  try {
    const json = JSON.stringify(resumeData, null, 2)
    const blob = new Blob([json], { type: 'application/json;charset=utf-8' })
    saveAs(blob, '简历.json')
  } catch (error) {
    console.error('导出 JSON 失败:', error)
    alert('导出 JSON 失败，请重试')
  }
}

// 导出为 PNG 图片
export const exportToPNG = async () => {
  let activeStyleElement = null
  try {
    const previewElement = document.querySelector('.resume-preview')
    if (!previewElement) {
      throw new Error('找不到预览区域')
    }

    // 临时移除选中状态的背景颜色
    activeStyleElement = removeActiveStyles()

    // 保存原始样式和滚动位置
    const originalOverflow = previewElement.style.overflow
    const originalScrollTop = previewElement.scrollTop
    const originalScrollLeft = previewElement.scrollLeft
    
    // 确保元素完全可见
    previewElement.style.overflow = 'visible'
    previewElement.scrollTop = 0
    previewElement.scrollLeft = 0

    // 等待内容渲染
    await new Promise(resolve => setTimeout(resolve, 100))

    // 获取元素的完整尺寸
    const elementHeight = previewElement.scrollHeight
    const elementWidth = previewElement.scrollWidth

    // 使用 html2canvas 将预览区域转换为图片，确保捕获完整内容
    const canvas = await html2canvas(previewElement, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      height: elementHeight,
      width: elementWidth,
      scrollX: 0,
      scrollY: 0,
      windowWidth: elementWidth,
      windowHeight: elementHeight,
      allowTaint: false,
      removeContainer: false
    })

    // 恢复原始样式和滚动位置
    previewElement.style.overflow = originalOverflow
    previewElement.scrollTop = originalScrollTop
    previewElement.scrollLeft = originalScrollLeft

    // 恢复选中状态的背景颜色
    restoreActiveStyles(activeStyleElement)

    canvas.toBlob((blob) => {
      if (blob) {
        saveAs(blob, '简历.png')
      }
    }, 'image/png')
  } catch (error) {
    console.error('导出 PNG 失败:', error)
    alert('导出 PNG 失败，请重试')
    // 确保恢复样式
    restoreActiveStyles(activeStyleElement)
  }
}
