import Owl from '@/assets/images/devlingo-char.png'
import { useState } from 'react'
import LessonModal from './LessonModal'
import LessonNode from './LessonNode'

// Renderiza uma coluna de estrelas com leve offset e sombra suave
const LessonsPath = () => {
  const [selectedUnitId, setSelectedUnitId] = useState<number | null>(null)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleUnitClick = (
    unitId: number,
    status: 'available' | 'completed' | 'locked'
  ) => {
    if (status === 'available' || status === 'completed') {
      setSelectedUnitId(unitId)
      setIsModalOpen(true)
    }

    console.log(`Clicou na unidade ${unitId}`)
  }

  return (
    <div className='relative w-full flex justify-center py-8'>
      <div className='flex flex-col'>
        <LessonNode
          status='available'
          onClick={() => handleUnitClick(1, 'available')}
        />

        <div style={{ transform: 'translateX(-40px)' }}>
          <LessonNode
            status='locked'
            onClick={() => handleUnitClick(2, 'locked')}
          />
        </div>

        <div
          className='relative w-full flex justify-center'
          style={{ transform: 'translateX(-60px)' }}
        >
          <LessonNode
            status='locked'
            onClick={() => handleUnitClick(3, 'locked')}
          />

          {/* Mascote ao lado do caminho */}
          <div className='absolute left-1/2 top-1/2 -translate-y-1/2 translate-x-24'>
            <div className='w-32 h-32 animate-float'>
              <img
                src={Owl}
                alt='Mascote Devlingo'
                className='w-full h-full object-contain'
              />
            </div>
          </div>
        </div>

        <div style={{ transform: 'translateX(-60px)' }}>
          <LessonNode
            status='locked'
            onClick={() => handleUnitClick(4, 'locked')}
          />
        </div>

        <div style={{ transform: 'translateX(-40px)' }}>
          <LessonNode
            status='locked'
            onClick={() => handleUnitClick(5, 'locked')}
          />
        </div>
      </div>

      <LessonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedUnitId={selectedUnitId ?? undefined}
      />
    </div>
  )
}

export default LessonsPath
