import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
import { Button } from 'antd'

export default function Unpublished() {
  const {dataSource, handlePublish} = usePublish(1)

  return (
    <>
      {/* button传过去箭头函数，组件内使用button(item.id),执行函数渲染并把id传过来 */}
      <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary' onClick={() => handlePublish(id)}>
        发布
      </Button>}></NewsPublish>
    </>
  )
}
