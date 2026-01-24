import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export function FaqsSection() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-7 px-4 mt-32">
      <div className="space-y-2">
        <h2 className="text-4xl md:text-6xl font-black leading-tight">
          Questions <span className="text-indigo-500 italic">Fréquentes</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl">
          Voici quelques questions et réponses fréquentes sur nos formations de
          mindfulness et bien-être. Si vous ne trouvez pas la réponse que vous
          cherchez, n'hésitez pas à nous contacter.
        </p>
      </div>
      <Accordion
        type="single"
        collapsible
        className="bg-card dark:bg-card/50 w-full -space-y-px rounded-lg "
        defaultValue="item-1"
      >
        {questions.map((item) => (
          <AccordionItem
            value={item.id}
            key={item.id}
            className="relative border-x first:rounded-t-lg first:border-t last:rounded-b-lg last:border-b"
          >
            <AccordionTrigger className="px-4 py-4 text-[15px] leading-6 hover:no-underline">
              {item.title}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground pb-4 px-4">
              {item.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

const questions = [
  {
    id: 'item-1',
    title: 'Comment se déroulent les formations ?',
    content:
      'Nos formations sont 100% en ligne, accessibles 24h/24. Vous avancez à votre propre rythme avec des supports vidéo et PDF.',
  },
  {
    id: 'item-2',
    title: 'Proposez-vous des facilités de paiement ?',
    content:
      'Oui, la plupart de nos programmes peuvent être réglés en 2 ou 3 fois sans frais supplémentaires.',
  },
  {
    id: 'item-3',
    title: 'Puis-je obtenir une facture pour mon entreprise ?',
    content:
      'Absolument. Une facture détaillée est générée automatiquement après chaque achat dans votre espace membre.',
  },
  {
    id: 'item-4',
    title: 'Les formations sont-elles accessibles à vie ?',
    content:
      'Oui, une fois inscrit, vous avez un accès illimité à vie à tous les contenus de la formation.',
  },
  {
    id: 'item-5',
    title: 'Y a-t-il un support pendant la formation ?',
    content:
      "Oui, vous bénéficiez d'un support personnalisé par email et d'une communauté d'apprenants pour vous accompagner.",
  },
]
