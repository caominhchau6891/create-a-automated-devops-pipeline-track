// 9we4_create_a_automa.ts

// Import necessary libraries
import { Injectable } from 'inversify';
import { Repository } from 'typeorm';
import { Pipeline } from './pipeline.entity';

// Define the DevOps pipeline tracker service
@Injectable()
export class DevOpsPipelineTracker {
  private pipelineRepository: Repository<Pipeline>;

  constructor(@InjectRepository(Pipeline) pipelineRepository: Repository<Pipeline>) {
    this.pipelineRepository = pipelineRepository;
  }

  // Method to create a new pipeline
  createPipeline(pipelineName: string, pipelineDescription: string): Promise<Pipeline> {
    const newPipeline = this.pipelineRepository.create({
      name: pipelineName,
      description: pipelineDescription,
      stages: []
    });
    return this.pipelineRepository.save(newPipeline);
  }

  // Method to add a stage to a pipeline
  addStageToPipeline(pipelineId: number, stageName: string): Promise<Pipeline> {
    return this.pipelineRepository.findOne(pipelineId).then(pipeline => {
      pipeline.stages.push(stageName);
      return this.pipelineRepository.save(pipeline);
    });
  }

  // Method to update a pipeline stage
  updateStage(pipelineId: number, stageName: string, status: string): Promise<Pipeline> {
    return this.pipelineRepository.findOne(pipelineId).then(pipeline => {
      const stageIndex = pipeline.stages.findIndex(s => s === stageName);
      if (stageIndex !== -1) {
        pipeline.stages[stageIndex] = `${stageName} - ${status}`;
        return this.pipelineRepository.save(pipeline);
      } else {
        throw new Error(`Stage ${stageName} not found in pipeline ${pipelineId}`);
      }
    });
  }

  // Method to get all pipelines
  getPipelines(): Promise<Pipeline[]> {
    return this.pipelineRepository.find();
  }

  // Method to get a pipeline by ID
  getPipeline(pipelineId: number): Promise<Pipeline> {
    return this.pipelineRepository.findOne(pipelineId);
  }
}

// Define the pipeline entity
@Entity()
export class Pipeline {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column("simple-array")
  stages: string[];
}