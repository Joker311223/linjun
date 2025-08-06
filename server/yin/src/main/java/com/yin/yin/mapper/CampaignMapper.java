package com.yin.yin.mapper;

import com.yin.yin.model.Campaign;
import com.yin.yin.model.CampaignPackage;
import com.yin.yin.model.CampaignStatus;
import com.yin.yin.model.CampaignType;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * 活动Mapper接口
 */
@Mapper
public interface CampaignMapper {
    /**
     * 根据ID查询活动
     */
    Campaign selectById(Long id);

    /**
     * 查询活动列表
     */
    List<Campaign> selectList(@Param("keyword") String keyword,
                             @Param("type") Integer type,
                             @Param("status") Integer status,
                             @Param("offset") Integer offset,
                             @Param("limit") Integer limit);

    /**
     * 查询活动总数
     */
    Long selectCount(@Param("keyword") String keyword,
                    @Param("type") Integer type,
                    @Param("status") Integer status);

    /**
     * 插入活动
     */
    int insert(Campaign campaign);

    /**
     * 更新活动
     */
    int update(Campaign campaign);

    /**
     * 删除活动
     */
    int deleteById(Long id);

    /**
     * 查询所有活动类型
     */
    List<CampaignType> selectAllTypes();

    /**
     * 查询所有活动状态
     */
    List<CampaignStatus> selectAllStatus();

    /**
     * 根据活动ID查询关联套餐
     */
    List<CampaignPackage> selectPackagesByCampaignId(Long campaignId);

    /**
     * 插入活动关联套餐
     */
    int insertCampaignPackage(CampaignPackage campaignPackage);

    /**
     * 删除活动关联套餐
     */
    int deleteCampaignPackagesByCampaignId(Long campaignId);
}
